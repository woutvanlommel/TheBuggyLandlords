import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerhuurderService } from '../../shared/verhuurder.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlusMicro } from '@ng-icons/heroicons/micro';
import { RouterLink } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-building-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, NgIcon, QuillEditorComponent],
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

    <div class="space-y-4" [class]="showAddBuildingModal ? 'min-h-180' : 'min-h-[150px]'">
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
                {{ building.place?.place }} • {{ building.rooms?.length || 0 }} Kamers •
                <span
                  routerLink="/dashboard/building/{{ building.id }}"
                  class="text-primary-300 hover:text-primary-500 hover:underline transition duration-200 ease"
                  >Bewerk gebouw</span
                >
              </p>
            </div>
          </div>

          <!-- <div class="flex justify-end items-center gap-4"> -->
          <!-- @if(building.expanded) {
            <div
              class="flex items-center justify-center p-2 rounded-md bg-primary hover:bg-primary-700 transition-colors duration-100 ease text-white"
              (click)="addRoom()"
            >
              <ng-icon name="heroPlusMicro" class="size-8"></ng-icon>
            </div>
            } -->
          <svg
            [class.rotate-180]="building.expanded"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-5 text-base-twee-400 transform transition-transform duration-200"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
          <!-- </div> -->
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
    <!-- Modal Container -->
    <div
      class="absolute w-full h-full top-0 left-0 inset-0 z-9999 flex items-center justify-center p-4 md:p-8 backdrop-blur-sm bg-base-twee-900/40 rounded-2xl"
      (click)="closeModal()"
    >
      <div
        class="bg-white w-full h-fit rounded-xl shadow-2xl flex flex-col overflow-hidden transform transition-all"
        (click)="$event.stopPropagation()"
      >
        <!-- Header -->
        <div
          class="px-8 py-6 border-b border-base-twee-100 flex items-center justify-between bg-base-een-50/30"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-7 h-7"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-base-twee-900">Nieuw Gebouw</h3>
              <p class="text-sm text-base-twee-500 font-medium">Beheer je vastgoed portfolio</p>
            </div>
          </div>
          <button
            (click)="closeModal()"
            class="p-3 hover:bg-white rounded-full transition-all text-base-twee-400 hover:text-base-twee-900 hover:rotate-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Form Content -->
        <div class="p-8 space-y-8 overflow-y-auto h-full w-full">
          <section class="space-y-6">
            <div class="relative">
              <label
                class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-2 px-1"
                >Straatnaam</label
              >
              <div class="relative group">
                <input
                  type="text"
                  [(ngModel)]="newBuilding.street"
                  (input)="onStreetInput()"
                  class="w-full pl-6 pr-12 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-semibold placeholder:text-base-twee-300 shadow-sm"
                  placeholder="Bijv. Diestsestraat"
                />
                <!-- Suggestion Loading Spinner -->
                @if (suggestLoading) {
                <div class="absolute right-4 top-1/2 -translate-y-1/2">
                  <div
                    class="w-5 h-5 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"
                  ></div>
                </div>
                }
              </div>

              <!-- Suggestions Dropdown -->
              @if (suggestions.length > 0) {
              <div
                class="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-base-twee-100 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200"
              >
                @for (suggestion of suggestions; track $index) {
                <div
                  (click)="selectSuggestion(suggestion)"
                  class="px-6 py-4 hover:bg-primary-50 cursor-pointer transition-colors border-b border-base-een-50 last:border-0 group flex items-center gap-4"
                >
                  <div
                    class="w-10 h-10 rounded-xl bg-base-een-50 flex items-center justify-center text-base-twee-400 group-hover:bg-primary-100 group-hover:text-primary-600 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p
                      class="font-bold text-base-twee-900 group-hover:text-primary-700 transition-colors"
                    >
                      {{ suggestion.street }}
                    </p>
                    <p class="text-sm text-base-twee-500">
                      {{ suggestion.postalCode }} {{ suggestion.city }}
                    </p>
                  </div>
                </div>
                }
              </div>
              }
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-2 px-1"
                  >Huisnummer</label
                >
                <input
                  type="text"
                  [(ngModel)]="newBuilding.number"
                  class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-semibold placeholder:text-base-twee-300 shadow-sm"
                  placeholder="123"
                />
              </div>
              <div>
                <label
                  class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-2 px-1"
                  >Postcode</label
                >
                <input
                  type="text"
                  [(ngModel)]="newBuilding.postalCode"
                  class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-semibold placeholder:text-base-twee-300 shadow-sm"
                  placeholder="3000"
                />
              </div>
            </div>

            <div>
              <label
                class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-2 px-1"
                >Stad / Gemeente</label
              >
              <input
                type="text"
                [(ngModel)]="newBuilding.city"
                class="w-full px-6 py-4 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none text-lg font-semibold placeholder:text-base-twee-300 shadow-sm"
                placeholder="Leuven"
              />
            </div>
          </section>

          <!-- Action Buttons -->
          <div class="pt-6 border-t border-base-een-100 flex flex-col sm:flex-row gap-4">
            <button
              (click)="closeModal()"
              class="flex-1 px-8 py-4 rounded-2xl text-lg font-bold text-base-twee-600 hover:bg-base-een-100 transition-all active:scale-95"
            >
              Annuleren
            </button>
            <button
              (click)="submitNewBuilding()"
              [disabled]="!newBuilding.street || !newBuilding.city || loading"
              class="flex-[2] px-8 py-4 rounded-2xl text-lg font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale disabled:pointer-events-none flex items-center justify-center gap-3"
            >
              @if (loading) {
              <div
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"
              ></div>
              }
              <span>{{ loading ? 'Bezig met opslaan...' : 'Gebouw Toevoegen' }}</span>
            </button>
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
  suggestions: any[] = [];
  suggestLoading: boolean = false;
  private suggestTimeout: any;

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

  onStreetInput() {
    clearTimeout(this.suggestTimeout);

    if (this.newBuilding.street.length < 1) {
      this.suggestions = [];
      this.suggestLoading = false;
      return;
    }

    this.suggestLoading = true;
    this.suggestTimeout = setTimeout(async () => {
      try {
        this.suggestions = await this.verhuurderService.suggestAddress(this.newBuilding.street);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        this.suggestLoading = false;
        this.cdr.detectChanges();
      }
    }, 100);
  }

  selectSuggestion(suggestion: any) {
    this.newBuilding.street = suggestion.street || this.newBuilding.street;
    this.newBuilding.city = suggestion.city || this.newBuilding.city;
    this.newBuilding.postalCode = suggestion.postalCode || this.newBuilding.postalCode;
    this.suggestions = [];
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showAddBuildingModal = false;
    this.newBuilding = {
      street: '',
      number: '',
      postalCode: '',
      city: '',
    };
    this.suggestions = [];
  }

  async submitNewBuilding() {
    try {
      this.loading = true; // Show loading state briefly or handle differently
      // Call service to save to database
      await this.verhuurderService.addBuilding(this.newBuilding);

      // Refresh list
      await this.loadBuildings();

      this.closeModal();
    } catch (error: any) {
      console.error('Error adding building:', error);
      const message =
        error.error?.message || 'Kon gebouw niet toevoegen. Probeer het later opnieuw.';
      alert(message);
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
