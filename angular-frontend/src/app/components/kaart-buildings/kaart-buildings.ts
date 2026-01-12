import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import { RoomService } from '../../shared/room.service';
import { Subject, takeUntil } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

// Icon fix voor Leaflet in Angular
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

@Component({
  selector: 'app-kaart-buildings',
  standalone: true,
  template: ` <div id="map" class="h-full w-full z-10"></div> `,
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None, // Nodig voor leaflet popup styles
})
export class KaartBuildings implements OnInit, OnDestroy {
  private map: L.Map | undefined;
  private markers: L.Marker[] = [];
  private destroy$ = new Subject<void>();
  private mapMove$ = new Subject<void>();

  constructor(private roomService: RoomService, @Inject(PLATFORM_ID) private platformId: Object) {
    // Luister naar beweging van de kaart (met vertraging om API te sparen)
    this.mapMove$
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(() => this.fetchRooms());
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
    // Startpositie Leuven
    this.map = L.map('map').setView([50.8798, 4.7005], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    // Event listener voor bewegen
    this.map.on('moveend', () => this.mapMove$.next());

    // Eerste data ophalen
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

    // Verwijder oude markers
    this.markers.forEach((m) => m.remove());
    this.markers = [];

    // Nieuwe markers plaatsen
    for (const room of rooms) {
      // Coördinaten kunnen direct op room staan (door onze map in controller) of in building
      const lat = room.lat || room.building?.latitude;
      const lng = room.lng || room.building?.longitude;

      if (lat && lng) {
        const marker = L.marker([lat, lng], { icon: defaultIcon }).bindPopup(`
            <div class="text-center">
              <strong class="text-lg">${room.roomtype || 'Kot'}</strong><br>
              ${room.building?.street?.street} ${room.building?.housenumber}<br>
              <span class="font-bold text-blue-600">€${room.price || '?'}</span>
            </div>
          `);

        marker.addTo(this.map);
        this.markers.push(marker);
      }
    }
  }
}
