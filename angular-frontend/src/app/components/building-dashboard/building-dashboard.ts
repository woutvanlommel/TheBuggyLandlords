import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerhuurderService } from '../../shared/verhuurder.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlusMicro } from '@ng-icons/heroicons/micro';

@Component({
  selector: 'app-building-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIcon],
  viewProviders: [provideIcons({ heroPlusMicro })],
  template: `
    <div class="flex items-center justify-between gap-3 mb-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-primary-600">Overzicht</p>
        <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Studenten per Kot</h3>
      </div>
      <button
        class="px-3 py-2 rounded-xl bg-base-een-100/50 backdrop-blur-sm text-base-twee-900 border border-base-twee-200 shadow hover:bg-white/80 transition-colors"
        (click)="showAddBuildingModal = true"
      >
        Voeg gebouw toe
      </button>
    </div>

    <div class="space-y-4">
      <!-- Loading State -->
      @if (loading) {
      <div class="text-center py-4 text-base-twee-500">Gebouwen laden...</div>
      }

      <!-- Empty State -->
      @if (!loading && buildings.length === 0) {
      <div class="text-center py-4 text-base-twee-500">Geen gebouwen gevonden.</div>
      }

      <!-- Building List -->
      @for (building of buildings; track building.id) {
      <div class="bg-base-een-100/30 border border-base-twee-200/50 rounded-xl overflow-hidden">
        <!-- Accordion Header -->
        <div
          (click)="toggleBuilding(building)"
          class="p-4 flex items-center justify-between cursor-pointer hover:bg-base-een-200/30 transition-colors group"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full bg-primary-100/50 flex items-center justify-center text-primary-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-base-twee-900">
                {{ building.street?.street }} {{ building.housenumber }}
              </h4>
              <p class="text-xs text-base-twee-500">
                {{ building.place?.place }} • {{ building.rooms?.length || 0 }} Kamers
              </p>
            </div>
          </div>

          <div class="flex justify-end items-center gap-4">
            @if(building.expanded) {
            <div
              class="flex items-center justify-center p-2 rounded-md bg-primary hover:bg-primary-700 transition-colors duration-100 ease text-white"
              (click)="addRoom()"
            >
              <ng-icon name="heroPlusMicro" class="size-8"></ng-icon>
            </div>
            }
            <svg
              [class.rotate-180]="building.expanded"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-5 text-base-twee-400 transform transition-transform duration-200"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
        </div>

        <!-- Accordion Content (Table) -->
        @if (building.expanded) {
        <div class="border-t border-base-twee-200/50 bg-white/30">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-base-twee-700">
              <thead
                class="text-xs uppercase text-base-twee-500 font-semibold border-b border-base-twee-200/50"
              >
                <tr>
                  <th class="px-4 py-3 bg-base-een-50/50">Kamer</th>
                  <th class="px-4 py-3 bg-base-een-50/50">Huurder</th>
                  <th class="px-4 py-3 bg-base-een-50/50">Status</th>
                  <th class="px-4 py-3 text-right bg-base-een-50/50">Actie</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-base-twee-200/50">
                @for (room of building.rooms; track room.id) {
                <tr class="hover:bg-base-een-200/30 transition-colors">
                  <td class="px-4 py-3 font-medium text-base-twee-900">
                    <!-- Display room name if exists, otherwise Room Type + Number (e.g. "Kot 1.01") -->
                    {{
                      room.name || (room.roomtype ? room.roomtype.type + ' ' : '') + room.roomnumber
                    }}
                  </td>
                  <td class="px-4 py-3">
                    <!-- Mock data checks, adjust based on real API -->
                    @if (room.active_contract?.user; as tenant) {
                    <div class="flex items-center gap-2">
                      <div
                        class="w-6 h-6 rounded-full bg-secondary-200 flex items-center justify-center text-secondary-800 text-xs font-bold"
                      >
                        {{ tenant.fname.charAt(0) }}
                      </div>
                      <span>{{ tenant.fname }} {{ tenant.name }}</span>
                    </div>
                    } @else {
                    <span class="text-base-twee-400 italic">Geen huurder</span>
                    }
                  </td>
                  <td class="px-4 py-3">
                    <span
                      class="px-2 py-1 rounded-full text-xs font-semibold"
                      [ngClass]="
                        room.active_contract
                          ? 'bg-secondary-100/50 text-secondary-900'
                          : 'bg-base-twee-100/50 text-base-twee-600'
                      "
                    >
                      {{ room.active_contract ? 'Verhuurd' : 'Beschikbaar' }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-right text-primary-600 cursor-pointer hover:underline">
                    Details
                  </td>
                </tr>
                } @if (!building.rooms || building.rooms.length === 0) {
                <tr>
                  <td colspan="4" class="px-4 py-6 text-center text-base-twee-400 text-sm">
                    Nog geen kamers toegevoegd aan dit gebouw.
                  </td>
                </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        }
      </div>
      }
    </div>

    @if (showAddBuildingModal) {
    <!-- Full Screen Overlay -->
    <div class="fixed inset-0 z-9999 bg-base-een-100 overflow-y-auto flex flex-col rounded-xl">
      <!-- Header -->
      <div
        class="sticky top-0 z-10 bg-white border-b border-base-twee-200 px-6 py-4 flex items-center justify-between shadow-sm"
      >
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-base-twee-900">Nieuw Gebouw Toevoegen</h3>
        </div>
        <button
          (click)="closeModal()"
          class="p-2 hover:bg-base-een-200 rounded-full transition-colors text-base-twee-500 hover:text-base-twee-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-7 w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <div class="flex-1 p-6 md:p-12 flex justify-center">
        <div class="w-full max-w-2xl">
          <div
            class="bg-white rounded-[2.5rem] shadow-xl border border-base-twee-100 p-8 md:p-12 space-y-8"
          >
            <section class="space-y-6">
              <div>
                <label
                  class="block text-sm font-bold text-base-twee-600 uppercase tracking-widest mb-2"
                  >Straatnaam</label
                >
                <input
                  type="text"
                  [(ngModel)]="newBuilding.street"
                  class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-medium"
                  placeholder="Bijv. Diestsestraat"
                />
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    class="block text-sm font-bold text-base-twee-600 uppercase tracking-widest mb-2"
                    >Huisnummer</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="newBuilding.number"
                    class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-medium"
                    placeholder="123"
                  />
                </div>
                <div>
                  <label
                    class="block text-sm font-bold text-base-twee-600 uppercase tracking-widest mb-2"
                    >Postcode</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="newBuilding.postalCode"
                    class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-medium"
                    placeholder="3000"
                  />
                </div>
              </div>

              <div>
                <label
                  class="block text-sm font-bold text-base-twee-600 uppercase tracking-widest mb-2"
                  >Stad / Gemeente</label
                >
                <input
                  type="text"
                  [(ngModel)]="newBuilding.city"
                  class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-medium"
                  placeholder="Leuven"
                />
              </div>
            </section>

            <div class="pt-8 border-t border-base-een-100 flex flex-col sm:flex-row gap-4">
              <button
                (click)="closeModal()"
                class="flex-1 px-8 py-4 rounded-2xl text-lg font-bold text-base-twee-600 hover:bg-base-een-100 transition-colors"
              >
                Annuleren
              </button>
              <button
                (click)="submitNewBuilding()"
                [disabled]="!newBuilding.street || !newBuilding.city"
                class="flex-[2] px-8 py-4 rounded-2xl text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
              >
                Gebouw Toevoegen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    }
  `,
  styles: ``,
})
export class BuildingDashboard implements OnInit {
  buildings: any[] = [];
  loading: boolean = true;
  showAddBuildingModal: boolean = false;
  newBuilding: any = {
    street: '',
    number: '',
    postalCode: '',
    city: '',
  };

  constructor(private verhuurderService: VerhuurderService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBuildings();
  }

  closeModal() {
    this.showAddBuildingModal = false;
    this.newBuilding = { street: '', number: '', postalCode: '', city: '' };
  }

  async submitNewBuilding() {
    try {
      this.loading = true; // Show loading state briefly or handle differently
      // Call service to save to database
      await this.verhuurderService.addBuilding(this.newBuilding);

      // Refresh list
      await this.loadBuildings();

      this.closeModal();
    } catch (error) {
      console.error('Error adding building:', error);
      alert('Kon gebouw niet toevoegen. Probeer het later opnieuw.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async addRoom() {
    // Logic to add a room can be implemented here
    alert('Functie om kamers toe te voegen is nog niet geïmplementeerd.');
  }

  async loadBuildings() {
    try {
      this.loading = true;
      // In a real app we would use the actual API response
      // For now we assume query works, or we mock if it fails/returns empty while developing
      const data = await this.verhuurderService.getMyBuildings();

      const buildingsArray = Array.isArray(data) ? data : (data as any).data || [];

      // Add 'expanded' property to each building for UI state
      this.buildings = buildingsArray.map((b: any) => ({ ...b, expanded: false }));
      console.log('Loaded buildings:', this.buildings);
    } catch (error) {
      console.error('Error loading buildings:', error);
      // Fallback/Mock data for demonstration if API fails or backend not ready
      this.buildings = [];
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  toggleBuilding(building: any) {
    building.expanded = !building.expanded;
  }
}
