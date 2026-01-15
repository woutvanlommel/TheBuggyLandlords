import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VerhuurderService } from '../../shared/verhuurder.service';

@Component({
  selector: 'app-room-editing',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-base-een-100 pb-20 rounded-lg">
      <!-- Header Area -->
      <div class="bg-white border-b border-base-twee-200 sticky top-0 z-30 shadow-sm rounded-t-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              [routerLink]="['/dashboard/building', room?.building_id]"
              class="p-2 hover:bg-base-een-100 rounded-full transition-colors text-base-twee-600 hover:text-base-twee-900"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <div>
              <h1 class="text-xl font-bold text-base-twee-900">Kamer Bewerken</h1>
              @if (room) {
              <p class="text-xs text-base-twee-500">
                {{
                  room.roomType?.name ||
                    room.roomType?.type ||
                    room.room_type?.type ||
                    room.roomtype?.type
                }}
                - {{ room.roomnumber }}
              </p>
              }
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              (click)="saveRoom()"
              [disabled]="loading || saving"
              class="px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold shadow hover:bg-primary-700 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              @if (saving) {
              <svg
                class="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              }
              {{ saving ? 'Bezig...' : 'Opslaan' }}
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        @if (loading) {
        <div class="flex flex-col items-center justify-center py-20">
          <div
            class="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mb-4"
          ></div>
          <p class="text-base-twee-500">Kamergegevens ophalen...</p>
        </div>
        } @else if (room) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Kamer Details Form -->
          <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-base-twee-100">
              <h2 class="text-lg font-bold text-base-twee-900 mb-6 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5 text-primary-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                Kamergegevens
              </h2>

              <div class="space-y-4">
                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                    >Naam (optioneel)</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="room.name"
                    class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    placeholder="Bijv. Luxe Studio"
                  />
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                    >Kamernummer</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="room.roomnumber"
                    class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                      >Huurprijs (€)</label
                    >
                    <input
                      type="number"
                      [(ngModel)]="room.price"
                      class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                      >Oppervlakte (m²)</label
                    >
                    <input
                      type="number"
                      [(ngModel)]="room.surface"
                      class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                    >Kamertype</label
                  >
                  <select
                    [(ngModel)]="room.roomtype_id"
                    class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all bg-white"
                  >
                    @for (type of roomTypes; track type.id) {
                    <option [value]="type.id" class="text-black">
                      {{ type.type || type.name || 'Onbekend' }}
                    </option>
                    }
                  </select>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                    >Beschrijving</label
                  >
                  <textarea
                    [(ngModel)]="room.description"
                    rows="4"
                    class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none"
                    placeholder="Vertel iets over de kamer..."
                  ></textarea>
                </div>

                <div class="pt-4 mt-6 border-t border-base-een-100">
                  <button
                    (click)="deleteRoom()"
                    class="w-full py-3 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Kamer Verwijderen
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Media Section -->
          <div class="lg:col-span-2 space-y-6">
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-base-twee-100">
              <h2 class="text-xl font-bold text-base-twee-900 mb-8 flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-6 h-6 text-primary-600"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                Hoofdfoto
              </h2>

              <div class="max-w-2xl">
                <div
                  class="relative aspect-video bg-base-een-100 rounded-3xl border border-base-twee-100 overflow-hidden group"
                >
                  @if (room.images && room.images.length > 0) {
                  <img [src]="room.images[0].file_path" class="w-full h-full object-cover" />
                  } @else {
                  <div
                    class="w-full h-full flex flex-col items-center justify-center text-base-twee-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-12 h-12 mb-2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                      />
                    </svg>
                    <p class="font-medium">Nog geen foto geüpload</p>
                  </div>
                  }

                  <div
                    class="absolute inset-0 bg-base-twee-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm"
                  >
                    <button
                      (click)="mainImageInput.click()"
                      class="px-6 py-3 bg-white text-base-twee-900 font-bold rounded-2xl flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
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
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Foto Wijzigen
                    </button>
                  </div>
                </div>
                <input
                  #mainImageInput
                  type="file"
                  (change)="onMainImageUpload($event)"
                  hidden
                  accept="image/*"
                />

                <div
                  class="mt-4 flex items-start gap-3 p-4 bg-primary-50 rounded-2xl border border-primary-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-5 h-5 text-primary-600 mt-0.5"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <p class="text-xs text-primary-800 leading-relaxed">
                    <strong>Tip:</strong> Gebruik een duidelijke, horizontale foto van de kamer.
                    Deze foto wordt getoond als eerste afbeelding in de zoekresultaten op het
                    platform.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class RoomEditing implements OnInit {
  room: any = null;
  roomTypes: any[] = [];
  loading = false;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verhuurderService: VerhuurderService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.loading = true;
    try {
      // Haal gegevens parallel op voor betere snelheid
      console.log('Fetching room types and room data for ID:', id);
      const [types, roomData] = await Promise.all([
        this.verhuurderService.getRoomTypes(),
        this.verhuurderService.getRoom(id),
      ]);

      this.roomTypes = types;
      this.room = roomData;

      console.log('Room Types loaded:', this.roomTypes);
      console.log('Room Data loaded:', this.room);
    } catch (error) {
      console.error('Fout bij het laden van kamer:', error);
      alert('Kon kamergegevens niet laden.');
    } finally {
      this.loading = false;
      // Gebruik timeout om zeker te zijn dat change detection draait
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  async saveRoom() {
    this.saving = true;
    try {
      await this.verhuurderService.updateRoom(this.room.id, {
        name: this.room.name,
        roomnumber: this.room.roomnumber,
        price: this.room.price,
        surface: this.room.surface,
        description: this.room.description,
        roomtype_id: this.room.roomtype_id,
      });
      alert('Kamer succesvol bijgewerkt!');
      // Gegevens herladen
      this.room = await this.verhuurderService.getRoom(this.room.id);
    } catch (error) {
      console.error('Fout bij opslaan:', error);
      alert('Fout bij opslaan van wijzigingen.');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  async onMainImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      // Type 7 = Hoofdafbeelding
      await this.verhuurderService.uploadRoomImage(this.room.id, file, 7);
      this.room = await this.verhuurderService.getRoom(this.room.id);
      alert('Hoofdfoto geüpload!');
    } catch (error) {
      console.error('Upload fout:', error);
      alert('Kon afbeelding niet uploaden.');
    } finally {
      this.cdr.detectChanges();
    }
  }

  async deleteRoom() {
    if (
      !confirm(
        'ZEER BELANGRIJK: Weet je zeker dat je deze kamer wilt verwijderen? Dit kan niet ongedaan worden gemaakt.'
      )
    )
      return;

    try {
      await this.verhuurderService.deleteRoom(this.room.id);
      alert('Kamer is verwijderd.');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Fout bij verwijderen kamer:', error);
      alert('Kon kamer niet verwijderen.');
    }
  }
}
