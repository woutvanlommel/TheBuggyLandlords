import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VerhuurderService } from '../../shared/verhuurder.service';

@Component({
  selector: 'app-room-editing',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div class="min-h-screen bg-transparent p-6 text-white overflow-y-auto">
      <!-- Header -->
      <div
        class="flex justify-between items-center mb-8 bg-[#1A1A1A]/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md"
      >
        <div>
          <h1
            class="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
          >
            Kamer Bewerken
          </h1>
          <p class="text-white/60">Beheer de details en afbeeldingen van deze kamer</p>
        </div>
        <button
          [routerLink]="['/dashboard']"
          class="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 flex items-center gap-2"
        >
          <span class="material-icons text-sm">arrow_back</span>
          Terug naar Dashboard
        </button>
      </div>

      @if (loading) {
      <div class="flex flex-col items-center justify-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"
        ></div>
        <p class="text-white/60">Kamergegevens ophalen...</p>
      </div>
      } @if (!loading && room) {
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">
        <!-- LINKER KOLOM: Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Basis Informatie -->
          <div class="bg-[#1A1A1A]/80 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <span class="material-icons text-blue-400">info</span>
              Basis Informatie
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-sm font-medium text-white/60">Kamer Naam (optioneel)</label>
                <input
                  type="text"
                  [(ngModel)]="room.name"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="Bijv. Luxe Studio"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-white/60">Kamernummer</label>
                <input
                  type="text"
                  [(ngModel)]="room.roomnumber"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-white/60">Prijs per maand (€)</label>
                <input
                  type="number"
                  [(ngModel)]="room.price"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium text-white/60">Oppervlakte (m²)</label>
                <input
                  type="number"
                  [(ngModel)]="room.surface"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-white/60">Kamertype</label>
                <select
                  [(ngModel)]="room.roomtype_id"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                >
                  @for (type of roomTypes; track type.id) {
                  <option [value]="type.id">{{ type.name }}</option>
                  }
                </select>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label class="text-sm font-medium text-white/60">Beschrijving</label>
                <textarea
                  [(ngModel)]="room.description"
                  rows="4"
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500/50 transition-all"
                  placeholder="Vertel iets over de kamer..."
                ></textarea>
              </div>
            </div>

            <div class="mt-8 flex justify-end">
              <button
                (click)="saveRoom()"
                [disabled]="saving"
                class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                @if (!saving) {
                <span class="material-icons">save</span>
                } @if (saving) {
                <span class="animate-spin material-icons">sync</span>
                }
                {{ saving ? 'Bezig met opslaan...' : 'Wijzigingen Opslaan' }}
              </button>
            </div>
          </div>
        </div>

        <!-- RECHTER KOLOM: Hoofdfoto -->
        <div class="space-y-8">
          <div class="bg-[#1A1A1A]/80 p-8 rounded-3xl border border-white/10 backdrop-blur-xl">
            <h2 class="text-xl font-bold mb-6 flex items-center gap-2">
              <span class="material-icons text-yellow-400">star</span>
              Hoofdfoto
            </h2>

            <div
              class="relative w-full aspect-[4/3] bg-white/5 rounded-2xl border border-white/10 overflow-hidden group"
            >
              @if (room.images && room.images.length > 0) {
              <img [src]="room.images[0].file_path" class="w-full h-full object-cover" />
              } @if (!room.images || room.images.length === 0) {
              <div class="w-full h-full flex flex-col items-center justify-center text-white/20">
                <span class="material-icons text-5xl">image</span>
                <p>Geen foto geüpload</p>
              </div>
              }

              <div
                class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
              >
                <button
                  (click)="mainImageInput.click()"
                  class="px-4 py-2 bg-white text-black font-bold rounded-lg flex items-center gap-2"
                >
                  <span class="material-icons">edit</span>
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

            <p class="text-xs text-white/40 mt-4 text-center italic">
              Deze foto wordt getoond als eerste afbeelding in zoekresultaten.
            </p>
          </div>

          <div class="bg-red-500/10 p-8 rounded-3xl border border-red-500/20 backdrop-blur-xl">
            <h2 class="text-xl font-bold mb-4 flex items-center gap-2 text-red-500">
              <span class="material-icons">delete_forever</span>
              Kamer Verwijderen
            </h2>
            <p class="text-white/60 text-sm mb-6">
              Pas op: Dit verwijdert de kamer en alle gelinkte afbeeldingen permanent.
            </p>
            <button
              (click)="deleteRoom()"
              class="w-full py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span class="material-icons">delete</span>
              Verwijder Kamer
            </button>
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class RoomEditing implements OnInit {
  room: any = null;
  roomTypes: any[] = [];
  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verhuurderService: VerhuurderService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.params['id'];
    try {
      this.roomTypes = await this.verhuurderService.getRoomTypes();
      this.room = await this.verhuurderService.getRoom(id);
    } catch (error) {
      console.error('Fout bij het laden van kamer:', error);
      alert('Kon kamergegevens niet laden.');
    } finally {
      this.loading = false;
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
