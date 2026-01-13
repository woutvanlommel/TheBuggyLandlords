// ... imports blijven hetzelfde ...
import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import * as L from 'leaflet';
import { RoomService } from '../../shared/room.service';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// ... Component decorator en styles blijven hetzelfde ...
@Component({
  selector: 'app-kaart-buildings',
  standalone: true,
  template: ` <div class="relative h-full w-full group">
    <!-- De Kaart -->
    <div id="map" class="h-full w-full z-10 custom-map-popups"></div>

    <!-- De Reset Knop -->
    <button
      (click)="resetMap()"
      class="absolute top-4 right-4 z-1000 bg-white text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg shadow-lg border border-gray-200 font-bold text-sm flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
      title="Terug naar Leuven"
    >
      <!-- SVG Icoontje (Refresh/Locatie) -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
      </svg>
      Reset Kaart
    </button>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
      /* Popup Styling */
      .custom-map-popups .leaflet-popup-content-wrapper {
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .custom-map-popups .leaflet-popup-content {
        margin: 0;
        width: 250px !important; /* Iets breder voor de knop */
      }
      /* Marker Styling (Bestaand) */
      .price-marker {
        transition: transform 0.2s ease;
      }
      .price-marker:hover {
        transform: scale(1.1);
        z-index: 999 !important;
      }
      .price-pill {
        background-color: white;
        color: #0f172a;
        font-weight: 700;
        border-radius: 9999px;
        padding: 4px 10px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        border: 1px solid #e2e8f0;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        cursor: pointer;
      }
      .price-pill.multiple {
        background-color: #2563eb;
        color: white;
        border-color: #1d4ed8;
      }

      /* NIEUW: Interactie styles voor de lijst in popup */
      .room-list-item:hover {
        background-color: #f8fafc;
      }
      .room-list-item:hover .action-btn {
        background-color: #2563eb;
        color: white;
        border-color: #2563eb;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class KaartBuildings implements OnInit, OnDestroy {
  // ... properties en constructor blijven hetzelfde ...
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];
  private destroy$ = new Subject<void>();
  private mapMove$ = new Subject<void>();

  private isPopupOpen: boolean = false;

  constructor(
    private roomService: RoomService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.mapMove$.pipe(debounceTime(300), takeUntil(this.destroy$)).subscribe(() => {
      if (!this.isPopupOpen) {
        this.fetchRooms();
      }
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.map?.remove();
  }

  private initMap(): void {
    // Zoom control uitgezet in opties (false) en rechtsonder handmatig toegevoegd
    this.map = L.map('map', { zoomControl: false }).setView([50.8798, 4.7005], 14);

    L.control.zoom({ position: 'bottomright' }).addTo(this.map);

    // KIES DEZE: Veel sneller dan OpenStreetMap en strak modern design
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    }).addTo(this.map);

    this.map.on('moveend', () => this.mapMove$.next());

    // 3. LISTENERS TOEVOEGEN
    // Zodra je een kot aanklikt: Blokkeer updates
    this.map.on('popupopen', () => {
      this.isPopupOpen = true;
    });

    // Zodra je de popup sluit: Sta updates weer toe
    this.map.on('popupclose', () => {
      this.isPopupOpen = false;
      // Optioneel: ververs direct als je sluit, zodat je weer up-to-date bent
      this.fetchRooms();
    });

    this.fetchRooms();
  }

  private fetchRooms(): void {
    if (!this.map) return;
    const bounds = this.map.getBounds();

    this.roomService
      .getRoomsByBBox(bounds.getSouth(), bounds.getNorth(), bounds.getWest(), bounds.getEast())
      .pipe(takeUntil(this.destroy$))
      .subscribe((rooms) => {
        this.updateMarkers(rooms);
      });
  }

  private updateMarkers(rooms: any[]): void {
    if (!this.map) return;

    // FIX: Als er een popup open is, negeer de binnenkomende data.
    // Dit voorkomt dat 'm.remove()' hieronder de marker met de actieve popup wist.
    if (this.isPopupOpen) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];

    const buildings: { [key: string]: any[] } = {};
    rooms.forEach((room) => {
      const key = room.building?.id || `${room.lat}-${room.lng}`;
      if (!buildings[key]) buildings[key] = [];
      buildings[key].push(room);
    });

    Object.values(buildings).forEach((buildingRooms: any[]) => {
      const firstRoom = buildingRooms[0];
      const lat = firstRoom.lat || firstRoom.building?.latitude;
      const lng = firstRoom.lng || firstRoom.building?.longitude;

      if (lat && lng) {
        // Icon Logic
        const count = buildingRooms.length;
        const lowestPrice = Math.min(...buildingRooms.map((r) => r.price));
        const label = count > 1 ? `${count} koten` : `€${lowestPrice}`;
        const cssClass = count > 1 ? 'price-pill multiple' : 'price-pill';

        const customIcon = L.divIcon({
          className: 'price-marker',
          html: `<div class="${cssClass}">${label}</div>`,
          iconSize: [60, 30],
          iconAnchor: [30, 15],
        });

        const marker = L.marker([lat, lng], { icon: customIcon }).addTo(this.map!);

        // Popup Content Logic
        let popupContent = '';

        if (count === 1) {
          // --- SINGLE ROOM ---
          popupContent = `
          <div class="flex flex-col cursor-pointer navigate-btn group" data-id="${firstRoom.id}">
            <!-- Image -->
            <div class="h-36 w-full bg-gray-200 bg-cover bg-center relative" 
                 style="background-image: url('${
                   firstRoom.images?.[0]?.url || 'assets/placeholder.jpg'
                 }')">
                 <div class="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold shadow-sm">
                    €${firstRoom.price}
                 </div>
            </div>
            
            <!-- Content -->
            <div class="p-3">
              <div class="flex justify-between items-start mb-1">
                <div>
                   <h3 class="font-bold text-gray-800 text-sm">${
                     firstRoom.building?.street?.street
                   } ${firstRoom.building?.housenumber}</h3>
                   <span class="text-xs text-blue-600 font-bold uppercase tracking-wider">${
                     firstRoom.roomtype || 'Studentenkamer'
                   }</span>
                </div>
              </div>
              
              <!-- DE KNOP -->
              <button class="mt-3 w-full bg-blue-600 text-white text-xs font-bold py-2 rounded-md transition-colors group-hover:bg-blue-700 shadow-sm border border-transparent">
                Bekijk kot
              </button>
            </div>
          </div>
        `;
        } else {
          // --- MULTIPLE ROOMS ---
          let listItems = '';
          buildingRooms.forEach((r) => {
            listItems += `
            <div class="room-list-item flex justify-between items-center py-2 px-2 border-b border-gray-100 last:border-0 cursor-pointer navigate-btn transition-colors" data-id="${
              r.id
            }">
               <div>
                 <div class="font-bold text-xs text-gray-800">${r.roomtype || 'Kamer'}</div>
                 <div class="text-blue-600 font-bold text-sm">€${r.price}</div>
               </div>
               
               <!-- DE KLEINE KNOP -->
               <span class="action-btn text-xs bg-white text-gray-600 border border-gray-200 font-bold px-3 py-1 rounded-full transition-all">
                 Bekijk
               </span>
            </div>
          `;
          });

          popupContent = `
          <div class="flex flex-col w-full">
            <div class="p-3 bg-gray-50 border-b border-gray-200">
              <h3 class="font-bold text-sm text-gray-800">
                 ${firstRoom.building?.street?.street} ${firstRoom.building?.housenumber}
              </h3>
              <p class="text-xs text-gray-500">${count} kamers beschikbaar</p>
            </div>
            <div class="max-h-56 overflow-y-auto">
               ${listItems}
            </div>
          </div>
        `;
        }

        const popup = L.popup({
          offset: [0, -10],
          closeButton: false,
          className: 'border-0 rounded-xl shadow-lg',
        }).setContent(popupContent);

        marker.bindPopup(popup);

        // Listener Logic
        marker.on('popupopen', () => {
          // We gebruiken een vertraging van 0ms om zeker te zijn dat de DOM render klaar is
          setTimeout(() => {
            const buttons = document.querySelectorAll('.navigate-btn');
            buttons.forEach((btn) => {
              btn.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement; // Use currentTarget for safe bubbling
                const id = target.getAttribute('data-id');

                if (id) {
                  this.ngZone.run(() => {
                    this.router.navigate(['kotcompass/rooms/', id]);
                  });
                }
              });
            });
          }, 0);
        });

        this.markers.push(marker);
      }
    });
  }

  public resetMap(): void {
    if (this.map) {
      // 1. Zet view terug naar Leuven (of je standaard coördinaten)
      this.map.setView([50.8798, 4.7005], 14);

      // 2. Omdat setView een 'move' event triggert,
      // wordt fetchRooms() automatisch al aangeroepen door de listener in InitMap!
    }
  }
}
