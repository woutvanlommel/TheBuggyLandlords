import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerhuurderService } from '../../shared/verhuurder.service';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../shared/room.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-building-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <!-- Header sectie met titel en knop voor verhuurders -->
    <div class="flex items-center justify-between gap-3 mb-4">
      <div>
        <p class="text-xs font-semibold tracking-wide text-primary-600">Overzicht</p>
        <h3 class="mt-1 text-lg font-semibold text-base-twee-900">
          {{ isLandlord ? 'Studenten per Kot' : 'Mijn Favorieten' }}
        </h3>
      </div>
      @if(isLandlord) {
        <button
          class="px-3 py-2 rounded-xl bg-base-een-100/50 backdrop-blur-sm text-base-twee-900 border border-base-twee-200 shadow hover:bg-white/80 transition-colors"
          (click)="showAddBuildingModal = true"
        >
          Voeg gebouw toe
        </button>
      }
    </div>

    <div class="space-y-4" [class]="showAddBuildingModal ? 'min-h-180' : 'min-h-150px'">

      <!-- Laadstatus weergave -->
      @if (loading) {
        <div class="flex flex-col gap-2 justify-center items-center py-8">
          <div class="text-center text-base-twee-500">Laden...</div>
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
        </div>
      }

      <!-- Lege status indien geen data -->
      @if (!loading && buildings.length === 0) {
        <div class="text-center py-8 text-base-twee-500 bg-base-een-50/50 rounded-xl border border-base-twee-100">
          Geen items gevonden.
        </div>
      }

      <!-- Hoofdlijst: Itereert over gebouwen (verhuurder) of kamers (huurder) -->
      @for (building of buildings; track building.favorite_room_id || building.id) {

        <!-- VERHUURDER WEERGAVE: Accordeon lijst -->
        @if (isLandlord) {
          <div class="bg-base-een-100/30 border border-base-twee-200/50 rounded-xl overflow-hidden mb-4 transition-all hover:shadow-sm">

            <!-- Gebouw header (klikbaar) -->
            <div
              (click)="toggleBuilding(building)"
              class="p-4 flex items-center justify-between cursor-pointer hover:bg-base-een-200/30 transition-colors group"
            >
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-full bg-white border border-base-twee-100 flex items-center justify-center text-primary-600 shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
                <div>
                  <h4 class="font-bold text-base-twee-900">
                    {{ building.street?.street || building.street }} {{ building.housenumber || building.number }}
                  </h4>
                  <p class="text-xs text-base-twee-500">
                    {{ building.city || building.place?.place }} • {{ building.rooms?.length || 0 }} Kamers
                  </p>
                </div>
              </div>
              <svg [class.rotate-180]="building.expanded" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 text-base-twee-400 transform transition-transform duration-200">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <!-- Uitklapbare inhoud: Tabel met kamers en statussen -->
            @if (building.expanded) {
              <div class="border-t border-base-twee-200/50 bg-white/50 backdrop-blur-sm">
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm text-base-twee-700">
                    <thead class="text-xs uppercase text-base-twee-500 font-semibold border-b border-base-twee-200/50 bg-base-een-50/30">
                      <tr>
                        <th class="px-4 py-3">Kamer</th>
                        <th class="px-4 py-3">Huurder</th>
                        <th class="px-4 py-3">Status</th>
                        <th class="px-4 py-3 text-right">Actie</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-base-twee-200/50">
                      @for (room of building.rooms; track room.id) {
                        <tr class="hover:bg-base-een-100/50 transition-colors">
                          <td class="px-4 py-3 font-medium text-base-twee-900">
                            {{ room.name || ((room.roomtype?.type || 'Kamer') + ' ' + (room.room_number || '')) }}
                          </td>
                          <td class="px-4 py-3">
                            <!-- Toon huurder of placeholder -->
                            @if (room.active_contract?.user; as tenant) {
                              <div class="flex items-center gap-2">
                                <div class="w-6 h-6 rounded-full bg-secondary-100 text-secondary-700 flex items-center justify-center text-xs font-bold">{{ tenant.fname.charAt(0) }}</div>
                                <span class="truncate max-w-[120px]">{{ tenant.fname }} {{ tenant.name }}</span>
                              </div>
                            } @else {
                              <span class="text-base-twee-400 italic text-xs">Geen huurder</span>
                            }
                          </td>
                          <td class="px-4 py-3">
                             <span class="px-2 py-1 rounded-md text-xs font-medium border"
                                   [ngClass]="room.active_contract ? 'bg-secondary-50 text-secondary-700 border-secondary-200' : 'bg-green-50 text-green-700 border-green-200'">
                               {{ room.active_contract ? 'Verhuurd' : 'Beschikbaar' }}
                             </span>
                          </td>
                          <td class="px-4 py-3 text-right">
                            <a routerLink="/dashboard/room/{{ room.id }}" class="text-primary-600 hover:text-primary-800 hover:underline text-xs font-medium cursor-pointer">Beheer</a>
                          </td>
                        </tr>
                      }
                      @if (!building.rooms || building.rooms.length === 0) {
                        <tr><td colspan="4" class="px-4 py-6 text-center text-base-twee-400 text-sm italic">Nog geen kamers toegevoegd.</td></tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            }
          </div>
        }

        <!-- HUURDER WEERGAVE: Favoriete kaarten -->
        @else {
          <div class="relative mb-4 group">

            <!-- Favoriet verwijderen knop -->
            <button
              (click)="removeFavorite($event, building)"
              class="absolute top-3 right-3 z-20 p-2 rounded-full bg-white/60 hover:bg-red-50 text-base-twee-400 hover:text-red-600 border border-transparent hover:border-red-100 transition-all shadow-sm backdrop-blur-sm cursor-pointer"
              title="Verwijder uit favorieten"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>

            <!-- Kamer details kaart -->
            <a
              [routerLink]="['/kotcompass/rooms', building.favorite_room_id]"
              class="block bg-white border border-base-twee-200 rounded-xl p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            >
              <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary-50 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div class="flex items-center gap-5 relative z-10 pr-10">
                <div class="w-12 h-12 rounded-2xl bg-base-een-50 flex items-center justify-center text-base-twee-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 shadow-sm border border-base-twee-100 group-hover:border-primary-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>

                <div class="flex-1">
                  <!-- Adres weergave met fallbacks voor data-structuur -->
                  <h4 class="font-bold text-lg text-base-twee-900 group-hover:text-primary-700 transition-colors">
                     {{ building.street?.street || building.street?.name || building.street || '' }}
                     {{ building.housenumber || building.number }}
                  </h4>

                  <div class="flex items-center gap-2 mt-1 text-sm text-base-twee-500">
                    <span class="font-medium text-base-twee-700">
                      {{ building.rooms[0]?.name || building.rooms[0]?.roomtype?.type || 'Kamer' }}
                      {{ building.rooms[0]?.room_number }}
                    </span>
                    @if(building.city || building.place?.place) {
                       <span>•</span>
                       <span>{{ building.city || building.place?.place }}</span>
                    }
                  </div>
                </div>
              </div>
            </a>
          </div>
        }
      }

    <!-- Modal voor toevoegen nieuw gebouw -->
    @if (showAddBuildingModal) {
      <div class="absolute w-full h-full top-0 left-0 inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-base-twee-900/20" (click)="closeModal()">
        <div class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" (click)="$event.stopPropagation()">

          <div class="px-8 py-5 border-b border-base-twee-100 flex items-center justify-between bg-gray-50">
            <h3 class="text-xl font-bold text-base-twee-900">Nieuw Gebouw Toevoegen</h3>
            <button (click)="closeModal()" class="p-2 hover:bg-gray-200 rounded-full transition-colors text-base-twee-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="p-8 overflow-y-auto">
            <div class="space-y-6">
              <!-- Straatnaam met autocomplete suggesties -->
              <div>
                <label class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5 ml-1">Straatnaam</label>
                <div class="relative">
                   <input type="text" [(ngModel)]="newBuilding.street" (input)="onStreetInput()" class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium" placeholder="bv. Naamsestraat">
                   @if(suggestLoading) { <div class="absolute right-3 top-3.5 w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div> }

                   @if (suggestions.length > 0) {
                     <div class="absolute z-10 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-base-twee-100 overflow-hidden max-h-48 overflow-y-auto">
                        @for(suggestion of suggestions; track $index) {
                          <div (click)="selectSuggestion(suggestion)" class="px-4 py-3 hover:bg-primary-50 cursor-pointer text-sm border-b border-gray-50 last:border-0">
                             <div class="font-bold text-base-twee-800">{{ suggestion.street }}</div>
                             <div class="text-xs text-base-twee-500">{{ suggestion.postalCode }} {{ suggestion.city }}</div>
                          </div>
                        }
                     </div>
                   }
                </div>
              </div>

              <!-- Overige adresvelden -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                   <label class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5 ml-1">Huisnummer</label>
                   <input type="text" [(ngModel)]="newBuilding.number" class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium" placeholder="10">
                </div>
                <div>
                   <label class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5 ml-1">Postcode</label>
                   <input type="text" [(ngModel)]="newBuilding.postalCode" class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium" placeholder="3000">
                </div>
              </div>

              <div>
                 <label class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5 ml-1">Stad</label>
                 <input type="text" [(ngModel)]="newBuilding.city" class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all font-medium" placeholder="Leuven">
              </div>
            </div>
          </div>

          <div class="px-8 py-5 bg-gray-50 border-t border-base-twee-100 flex gap-3">
             <button (click)="closeModal()" class="flex-1 py-3 rounded-xl font-bold text-base-twee-600 hover:bg-base-twee-200 transition-colors">Annuleren</button>
             <button (click)="submitNewBuilding()" [disabled]="!newBuilding.street || !newBuilding.city || loading" class="flex-2 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
                @if(loading) { <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> }
                Opslaan
             </button>
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
  isLandlord: boolean = false;

  newBuilding: any = { street: '', number: '', postalCode: '', city: '' };

  constructor(private verhuurderService: VerhuurderService, private cdr: ChangeDetectorRef, private roomService: RoomService, private authService: AuthService) {}

  // Initialisatie: Check rol en laad data
  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      const roleName = (user.role || '').toLowerCase();
      this.isLandlord = (Number(user.role_id) === 2 || roleName === 'landlord' || roleName === 'verhuurder');
    }
    this.loadBuildings();
  }

  // Adres suggesties ophalen (met debounce)
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
        console.error(error);
      } finally {
        this.suggestLoading = false;
        this.cdr.detectChanges();
      }
    }, 100);
  }

  // Suggestie selecteren en formulier vullen
  selectSuggestion(suggestion: any) {
    this.newBuilding.street = suggestion.street;
    this.newBuilding.city = suggestion.city;
    this.newBuilding.postalCode = suggestion.postalCode;
    this.suggestions = [];
  }

  closeModal() {
    this.showAddBuildingModal = false;
    this.newBuilding = { street: '', number: '', postalCode: '', city: '' };
    this.suggestions = [];
  }

  // Nieuw gebouw opslaan via API
  async submitNewBuilding() {
    try {
      this.loading = true;
      await this.verhuurderService.addBuilding(this.newBuilding);
      await this.loadBuildings();
      this.closeModal();
    } catch (error: any) {
      alert(error.error?.message || 'Fout bij opslaan');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // Haal gebouwen (verhuurder) of favorieten (huurder) op
  async loadBuildings() {
    try {
      this.loading = true;
      let data;
      if (this.isLandlord) {
        data = await this.verhuurderService.getMyBuildings();
        const buildingsArray = Array.isArray(data) ? data : (data as any).data || [];
        this.buildings = buildingsArray.map((b: any) => ({ ...b, expanded: false }));
      } else {
        this.roomService.getFavorites().subscribe({
          next: (favs: any) => {
            const rawData = Array.isArray(favs) ? favs : (favs as any).data || [];
            this.buildings = rawData.map((room: any) => ({
              ...room.building,
              rooms: [room],
              expanded: false,
              favorite_room_id: room.id
            }));
            this.loading = false;
            this.cdr.detectChanges();
          },
          error: () => this.loading = false
        });
        return;
      }
    } catch (error) {
      this.buildings = [];
    } finally {
      if (this.isLandlord) { this.loading = false; this.cdr.detectChanges(); }
    }
  }

  toggleBuilding(building: any) {
    building.expanded = !building.expanded;
  }

  // Favoriet verwijderen (alleen voor huurders)
  removeFavorite(event: Event, building: any) {
    event.stopPropagation();
    event.preventDefault();

    if (building.isDeleting) return;
    building.isDeleting = true;

    const roomId = building.favorite_room_id;

    this.roomService.toggleFavorite(roomId).subscribe({
      next: (response: any) => {
        building.isDeleting = false;

        // Als item uit favorieten is verwijderd, update de lokale lijst
        if (!response.is_favorited) {
           this.buildings = this.buildings.filter(b => b.favorite_room_id !== roomId);
           this.cdr.detectChanges();
        }
      },
      error: (err) => {
        building.isDeleting = false;
        console.error('Fout bij verwijderen:', err);
      }
    });
  }
}
