import { Component, Input, OnInit, inject } from '@angular/core';
import { RoomService } from '../../shared/room.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckCircle, heroXMark } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-facilities-kotpage',
  standalone: true,
  imports: [NgIcon],
  providers: [provideIcons({ heroCheckCircle, heroXMark })],
  template: `
    <div class="w-full py-16">
      <div class="max-w-full p-8 rounded-2xl bg-primary/10">
        <!-- Header -->
        <div class="flex flex-col gap-2 mb-10">
          <h2 class="text-3xl md:text-4xl font-extrabold text-primary-900 tracking-tight">
            Voorzieningen & Faciliteiten
          </h2>
          <p class="text-gray-500 text-sm md:text-base font-medium">
            Een overzicht van alle beschikbare extra's en diensten in deze kamer.
          </p>
        </div>

        @if (allFacilities.length > 0) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 lg:gap-x-20">
            @for (allFac of allFacilities; track allFac.id) {
              <div
                class="flex items-center justify-between py-5 border-b-2 border-primary-500/10 hover:border-primary-500/40 hover:bg-primary-50/10 transition-all duration-300 px-4 group"
              >
                <!-- Text Container -->
                <div class="flex flex-col gap-0.5">
                  <span
                    class="text-base md:text-lg font-bold transition-colors duration-300"
                    [class.text-primary-900]="isAvailable(allFac.id)"
                    [class.text-gray-400]="!isAvailable(allFac.id)"
                  >
                    {{ allFac.facility }}
                  </span>
                  @if (isAvailable(allFac.id)) {
                    <span class="text-[10px] uppercase tracking-widest font-black text-primary-400">
                      Inbegrepen
                    </span>
                  }
                </div>

                <!-- Icon Container -->
                <div class="flex items-center justify-center relative">
                  @if (isAvailable(allFac.id)) {
                    <div
                      class="absolute inset-0 bg-primary-400/20 blur-xl rounded-full animate-pulse group-hover:bg-primary-400/30"
                    ></div>
                    <ng-icon
                      name="heroCheckCircle"
                      class="text-3xl text-primary-500 transition-all duration-500 scale-110"
                    ></ng-icon>
                  } @else {
                    <ng-icon
                      name="heroXMark"
                      class="text-2xl text-gray-200 transition-all duration-300"
                    ></ng-icon>
                  }
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Luxury Skeleton Loading -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 animate-pulse">
            @for (i of [1, 2, 3, 4, 5, 6]; track i) {
              <div class="h-20 bg-gray-50 rounded-2xl mb-4 opacity-50"></div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class FacilitiesKotpage implements OnInit {
  @Input() facilities: any[] = []; // De faciliteiten die aanwezig zijn in deze kamer
  allFacilities: any[] = [];

  private roomService = inject(RoomService);

  ngOnInit() {
    this.roomService.getFacilities().subscribe({
      next: (data) => {
        // Sorteer op naam zodat de lijst consistent is
        this.allFacilities = data.sort((a, b) => a.facility.localeCompare(b.facility));
      },
      error: (err) => {
        console.error('Fout bij ophalen alle voorzieningen:', err);
      },
    });
  }

  isAvailable(id: number): boolean {
    if (!this.facilities) return false;
    // Check of het ID voorkomt in de lijst van kamer-faciliteiten
    return this.facilities.some((f) => {
      if (typeof f === 'object' && f !== null) {
        return f.id === id;
      }
      return f === id;
    });
  }
}
