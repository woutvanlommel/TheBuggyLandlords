import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VerhuurderService } from '../../shared/verhuurder.service';
import { QuillEditorComponent } from 'ngx-quill';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroKeyMicro } from '@ng-icons/heroicons/micro';

@Component({
  selector: 'app-building-editing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, QuillEditorComponent, NgIcon],
  viewProviders: [provideIcons({ heroKeyMicro })],
  template: `
    <div class="min-h-screen bg-base-een-100 pb-20 rounded-lg">
      <!-- Header Area -->
      <div class="bg-white border-b border-base-twee-200 sticky top-0 z-30 shadow-sm rounded-t-xl">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              routerLink="/dashboard/stats"
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
              <h1 class="text-xl font-bold text-base-twee-900">Gebouw Bewerken</h1>
              <p class="text-xs text-base-twee-500" *ngIf="building">
                {{ building.street?.street }} {{ building.housenumber }},
                {{ building.place?.place }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <button
              (click)="saveBuilding()"
              [disabled]="loading"
              class="px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold shadow hover:bg-primary-700 transition-all disabled:opacity-50"
            >
              Opslaan
            </button>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Building Details Form -->
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
                    d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-3h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h18"
                  />
                </svg>
                Gebouwgegevens
              </h2>

              <div class="space-y-4" *ngIf="building">
                <div class="relative">
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                    >Straat</label
                  >
                  <div class="relative">
                    <input
                      type="text"
                      [(ngModel)]="editBuilding.street"
                      (input)="onStreetInput()"
                      class="w-full pl-4 pr-10 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                    @if(suggestLoading) {
                    <div class="absolute right-3 top-1/2 -translate-y-1/2">
                      <div
                        class="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin"
                      ></div>
                    </div>
                    }
                  </div>

                  <!-- Suggestions Dropdown -->
                  @if(suggestions.length > 0) {
                  <div
                    class="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-base-twee-100 overflow-hidden max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-200"
                  >
                    @for (suggestion of suggestions; track $index) {
                    <div
                      (click)="selectSuggestion(suggestion)"
                      class="px-4 py-2 hover:bg-primary-50 cursor-pointer transition-colors border-b border-base-een-50 last:border-0 text-sm group"
                    >
                      <p
                        class="font-bold text-base-twee-900 group-hover:text-primary-700 transition-colors"
                      >
                        {{ suggestion.street }}
                      </p>
                      <p class="text-[10px] text-base-twee-500">
                        {{ suggestion.postalCode }} {{ suggestion.city }}
                      </p>
                    </div>
                    }
                  </div>
                  }
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                      >Huisnummer</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="editBuilding.housenumber"
                      class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                      >Postcode</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="editBuilding.postalCode"
                      class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-wider mb-1"
                    >Stad</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="editBuilding.city"
                    class="w-full px-4 py-3 rounded-xl border border-base-twee-200 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  />
                </div>

                <div class="pt-4 mt-6 border-t border-base-een-100">
                  <button
                    (click)="deleteBuilding()"
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
                    Gebouw Verwijderen
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Rooms Management -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Building Description -->
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
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                  />
                </svg>
                Beschrijving van het gebouw
              </h2>
              <quill-editor
                [(ngModel)]="editBuilding.description"
                class="block w-full bg-white rounded-2xl overflow-hidden border-2 border-base-een-200 focus-within:border-primary-500 transition-all font-sans"
                [styles]="{ height: '350px' }"
                placeholder="Geef hier een uitgebreide beschrijving van het gebouw, de ligging, en eventuele extra troeven..."
              ></quill-editor>
            </div>

            <div
              class="bg-white rounded-3xl p-6 shadow-sm border border-base-twee-100 min-h-[500px]"
            >
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-xl font-bold text-base-twee-900 flex items-center gap-2">
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
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5-1.5-3-1m-2.25-3.41 1.5-.545m0 2.045 4.5-1.636M2.25 3h4.5M2.25 3v1.5M4.5 9v1.5M18.75 3v1.5M21 9v1.5"
                    />
                  </svg>
                  Koten & Kamers
                </h2>
                <button
                  (click)="openAddRoomModal()"
                  class="px-5 py-2.5 bg-primary-100 text-primary-700 rounded-2xl font-bold text-sm hover:bg-primary-200 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    class="w-4 h-4"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  Kot Toevoegen
                </button>
              </div>

              <!-- Loading Indicator -->
              <div
                *ngIf="loading"
                class="flex flex-col items-center justify-center py-20 text-base-twee-400"
              >
                <div
                  class="animate-spin rounded-full h-10 w-10 border-4 border-primary-500 border-t-transparent mb-4"
                ></div>
                <p>Koten laden...</p>
              </div>

              <!-- Empty State -->
              <div
                *ngIf="!loading && (!building?.rooms || building.rooms.length === 0)"
                class="text-center py-20 bg-base-een-100/50 rounded-3xl border-2 border-dashed border-base-twee-200"
              >
                <div
                  class="w-20 h-20 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-base-twee-300 shadow-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1"
                    stroke="currentColor"
                    class="w-10 h-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5-1.5-3-1m-2.25-3.41 1.5-.545m0 2.045 4.5-1.636M2.25 3h4.5M2.25 3v1.5M4.5 9v1.5M18.75 3v1.5M21 9v1.5"
                    />
                  </svg>
                </div>
                <h3 class="font-bold text-base-twee-900 mb-1">Nog geen koten</h3>
                <p class="text-sm text-base-twee-500 max-w-xs mx-auto mb-6">
                  Voeg je eerste kamer toe om te beginnen met verhuren.
                </p>
                <button
                  (click)="openAddRoomModal()"
                  class="px-6 py-2 bg-primary-600 text-white rounded-xl font-semibold shadow hover:bg-primary-700 transition-all"
                >
                  Snel Toevoegen
                </button>
              </div>

              <!-- Room Grid -->
              @if (!loading && building?.rooms?.length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (room of building.rooms; track room.id) {
                <div
                  class="bg-base-een-100/30 border border-base-twee-100 p-5 rounded-3xl group hover:border-primary-200 hover:bg-white transition-all"
                >
                  <div class="flex justify-between items-start mb-4">
                    <div class="flex items-center gap-3">
                      <div
                        class="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary-600 font-bold group-hover:bg-primary-600 group-hover:text-white transition-all"
                      >
                        <ng-icon name="heroKeyMicro" class="w-6 h-6"></ng-icon>
                      </div>
                      <div>
                        <h4 class="font-bold text-base-twee-900">
                          {{ room.name || room.roomtype?.type || 'Kamer' }}
                        </h4>
                        <p
                          class="text-[10px] text-base-twee-400 font-bold uppercase tracking-widest"
                        >
                          €{{ room.price }} / maand
                        </p>
                      </div>
                    </div>

                    <div
                      class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        routerLink="/dashboard/room/{{ room.id }}"
                        class="p-2 hover:bg-primary-50 rounded-xl text-primary-600 transition-colors"
                        title="Bewerken"
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
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                          />
                        </svg>
                      </button>
                      <button
                        (click)="deleteRoom(room.id)"
                        class="p-2 hover:bg-red-50 rounded-xl text-red-500 transition-colors"
                        title="Verwijderen"
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
                      </button>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    <span
                      class="px-3 py-1 bg-white rounded-full text-[10px] font-bold shadow-sm"
                      [ngClass]="room.active_contract ? 'text-orange-600' : 'text-green-600'"
                    >
                      ● {{ room.active_contract ? 'Verhuurd' : 'Beschikbaar' }}
                    </span>
                    <span class="text-[10px] text-base-twee-400 font-bold"
                      >{{ room.surface }}m²</span
                    >
                  </div>
                </div>
                }
              </div>
              }
            </div>
          </div>
        </div>

        <!-- Add/Edit Room Modal -->
        <div
          *ngIf="showRoomModal"
          class="fixed inset-0 z-[100] bg-base-twee-900/60 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            class="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            (click)="$event.stopPropagation()"
          >
            <div
              class="px-8 py-6 border-b border-base-twee-100 flex justify-between items-center bg-base-een-50/30"
            >
              <h3 class="text-xl font-bold text-base-twee-900">
                {{ editingRoomId ? 'Kot Bewerken' : 'Nieuw Kot Toevoegen' }}
              </h3>
              <button
                (click)="closeRoomModal()"
                class="p-2 hover:bg-white rounded-full transition-colors text-base-twee-400 hover:text-base-twee-900"
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
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div class="p-8 space-y-6">
              <div>
                <label
                  class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5"
                  >Naam / Omschrijving</label
                >
                <input
                  type="text"
                  [(ngModel)]="currentRoom.name"
                  class="w-full px-5 py-3 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 outline-none transition-all"
                  placeholder="Bijv. Kot 1.01 (straatkant)"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5"
                    >Kamernummer</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="currentRoom.roomnumber"
                    class="w-full px-5 py-3 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 outline-none transition-all"
                    placeholder="1.01"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5"
                    >Type</label
                  >
                  <select
                    [(ngModel)]="currentRoom.roomtype_id"
                    class="w-full px-5 py-3 rounded-2xl border-2 border-base-een-200 bg-white focus:border-primary-500 outline-none transition-all appearance-none"
                  >
                    <option *ngFor="let type of roomTypes" [value]="type.id">
                      {{ type.type }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5"
                    >Huurprijs (€)</label
                  >
                  <input
                    type="number"
                    [(ngModel)]="currentRoom.price"
                    class="w-full px-5 py-3 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label
                    class="block text-xs font-bold text-base-twee-500 uppercase tracking-widest mb-1.5"
                    >Oppervlakte (m²)</label
                  >
                  <input
                    type="number"
                    [(ngModel)]="currentRoom.surface"
                    class="w-full px-5 py-3 rounded-2xl border-2 border-base-een-200 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div class="p-8 border-t border-base-twee-100 flex gap-3">
              <button
                (click)="closeRoomModal()"
                class="flex-1 py-4 text-base-twee-600 font-bold hover:bg-base-een-100 rounded-2xl transition-colors"
              >
                Annuleren
              </button>
              <button
                (click)="saveRoom()"
                [disabled]="!currentRoom.roomnumber || !currentRoom.price"
                class="flex-[1.5] py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-lg hover:bg-primary-700 transition-all active:scale-95 disabled:opacity-50"
              >
                Kot Opslaan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class BuildingEditing implements OnInit {
  building: any = null;
  editBuilding: any = {
    street: '',
    housenumber: '',
    postalCode: '',
    city: '',
    description: '',
  };
  suggestions: any[] = [];
  suggestLoading: boolean = false;
  private suggestTimeout: any;
  loading: boolean = true;
  roomTypes: any[] = [
    { id: 1, type: 'Kamer' },
    { id: 2, type: 'Studio' },
    { id: 3, type: 'Appartement' },
  ];

  showRoomModal: boolean = false;
  editingRoomId: number | null = null;
  currentRoom: any = {
    name: '',
    roomnumber: '',
    roomtype_id: 1,
    price: 0,
    surface: 0,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private verhuurderService: VerhuurderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
    this.loadRoomTypes();
  }

  onStreetInput() {
    clearTimeout(this.suggestTimeout);

    if (this.editBuilding.street.length < 1) {
      this.suggestions = [];
      this.suggestLoading = false;
      return;
    }

    this.suggestLoading = true;
    this.suggestTimeout = setTimeout(async () => {
      try {
        this.suggestions = await this.verhuurderService.suggestAddress(this.editBuilding.street);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        this.suggestLoading = false;
        this.cdr.detectChanges();
      }
    }, 100);
  }

  selectSuggestion(suggestion: any) {
    this.editBuilding.street = suggestion.street || this.editBuilding.street;
    this.editBuilding.city = suggestion.city || this.editBuilding.city;
    this.editBuilding.postalCode = suggestion.postalCode || this.editBuilding.postalCode;
    this.suggestions = [];
    this.cdr.detectChanges();
  }

  async loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    try {
      this.loading = true;
      // Gebruik de specifieke endpoint voor betere performance
      this.building = await this.verhuurderService.getBuilding(+id);

      if (this.building) {
        this.editBuilding = {
          street: this.building.street?.street || '',
          housenumber: this.building.housenumber || '',
          postalCode: this.building.place?.zipcode || '',
          city: this.building.place?.place || '',
          description: this.building.description || '',
        };
      } else {
        alert('Gebouw niet gevonden.');
        this.router.navigate(['/dashboard/stats']);
      }
    } catch (error) {
      console.error('Error loading building:', error);
      alert('Er is een fout opgetreden bij het laden van het gebouw.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async loadRoomTypes() {
    try {
      const types = await this.verhuurderService.getRoomTypes();
      if (types && types.length > 0) {
        this.roomTypes = types;
      }
    } catch (error) {
      console.warn('Could not load room types, using defaults.');
    }
  }

  async saveBuilding() {
    if (!this.building) return;
    try {
      this.loading = true;
      await this.verhuurderService.updateBuilding(this.building.id, this.editBuilding);
      alert('Gebouw succesvol bijgewerkt!');
      await this.loadData();
    } catch (error: any) {
      console.error('Error saving building:', error);
      const message = error.error?.message || 'Er is een fout opgetreden bij het opslaan.';
      alert(message);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteBuilding() {
    if (!this.building) return;
    if (
      !confirm(
        'Weet je zeker dat je dit gebouw wilt verwijderen? Alle bijbehorende koten worden ook verwijderd.'
      )
    )
      return;

    try {
      this.loading = true;
      await this.verhuurderService.deleteBuilding(this.building.id);
      this.router.navigate(['/dashboard/stats']);
    } catch (error) {
      console.error('Error deleting building:', error);
      alert('Kon gebouw niet verwijderen.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // Room Management
  openAddRoomModal() {
    this.editingRoomId = null;
    this.currentRoom = {
      name: '',
      roomnumber: '',
      roomtype_id: this.roomTypes[0]?.id || 1,
      price: 0,
      surface: 0,
      building_id: this.building.id,
    };
    this.showRoomModal = true;
  }

  openEditRoomModal(room: any) {
    this.editingRoomId = room.id;
    this.currentRoom = { ...room, roomtype_id: room.roomtype_id || room.roomtype?.id || 1 };
    this.showRoomModal = true;
  }

  closeRoomModal() {
    this.showRoomModal = false;
  }

  async saveRoom() {
    try {
      this.loading = true;
      if (this.editingRoomId) {
        await this.verhuurderService.updateRoom(this.editingRoomId, this.currentRoom);
      } else {
        await this.verhuurderService.addRoom(this.currentRoom);
      }
      this.closeRoomModal();
      await this.loadData();
    } catch (error) {
      console.error('Error saving room:', error);
      alert('Kon kot niet opslaan.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async deleteRoom(id: number) {
    if (!confirm('Weet je zeker dat je dit kot wilt verwijderen?')) return;
    try {
      this.loading = true;
      await this.verhuurderService.deleteRoom(id);
      await this.loadData();
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Kon kot niet verwijderen.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
