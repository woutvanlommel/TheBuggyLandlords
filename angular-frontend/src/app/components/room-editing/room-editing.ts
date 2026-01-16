import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VerhuurderService } from '../../shared/verhuurder.service';
import { QuillEditorComponent } from 'ngx-quill';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-room-editing',
  standalone: true,
  imports: [FormsModule, RouterModule, QuillEditorComponent, DatePipe],
  template: `
    <div class="min-h-screen bg-base-een-100 pb-20 rounded-lg">
      <!-- Header Area -->
      <div
        class="bg-white border-b border-base-twee-200 sticky top-0 z-30 shadow-sm rounded-t-lg font-poppins"
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button
              [routerLink]="['/dashboard/building', room?.building_id]"
              class="p-2 hover:bg-base-een-100 rounded-full transition-colors text-base-twee-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h1 class="text-xl font-bold text-base-twee-900">Kamer Bewerken</h1>
          </div>
          <button
            (click)="saveRoom()"
            [disabled]="loading || saving"
            class="px-8 py-2.5 bg-primary-600 text-white rounded-xl font-bold shadow-lg hover:bg-primary-700 transition-all disabled:opacity-50 active:scale-95"
          >
            {{ saving ? 'Bezig...' : 'Opslaan' }}
          </button>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        @if (loading) {
        <div class="flex flex-col items-center justify-center py-40 gap-4">
          <span
            class="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"
          ></span>
          <p class="text-base-twee-400 font-bold uppercase text-[10px] tracking-widest">
            Gegevens ophalen...
          </p>
        </div>
        } @else if (room) {
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <!-- LEFT COLUMN (Sidebar) -->
          <div class="lg:col-span-4 space-y-8">
            <!-- Basic Details -->
            <div
              class="bg-white rounded-[32px] p-8 shadow-sm border border-base-twee-100 font-poppins relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-2 h-full bg-primary-500"></div>
              <h2 class="text-lg font-bold text-base-twee-900 mb-8 flex items-center gap-3">
                <span class="p-2 bg-primary-50 rounded-lg text-primary-600 font-black text-xs"
                  >01</span
                >
                Basisgegevens
              </h2>

              <div class="space-y-5">
                <div>
                  <label class="block text-[10px] font-black text-base-twee-400 uppercase mb-2 ml-1"
                    >Naam / Label</label
                  >
                  <input
                    type="text"
                    [(ngModel)]="room.name"
                    class="w-full px-5 py-4 rounded-2xl border border-base-twee-100 bg-base-een-50 outline-none focus:border-primary-400 transition-all font-medium text-base-twee-700"
                    placeholder="E.g. Studio XL 101"
                  />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      class="block text-[10px] font-black text-base-twee-400 uppercase mb-2 ml-1"
                      >Kmr Nr.</label
                    >
                    <input
                      type="text"
                      [(ngModel)]="room.roomnumber"
                      class="w-full px-5 py-4 rounded-2xl border border-base-twee-100 bg-base-een-50 outline-none focus:border-primary-400 transition-all font-medium text-base-twee-700"
                    />
                  </div>
                  <div>
                    <label
                      class="block text-[10px] font-black text-base-twee-400 uppercase mb-2 ml-1"
                      >Oppervlakte (m²)</label
                    >
                    <input
                      type="number"
                      [(ngModel)]="room.surface"
                      class="w-full px-5 py-4 rounded-2xl border border-base-twee-100 bg-base-een-50 outline-none focus:border-primary-400 transition-all font-medium text-base-twee-700"
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] font-black text-base-twee-400 uppercase mb-2 ml-1"
                    >Type Accommodatie</label
                  >
                  <select
                    [(ngModel)]="room.roomtype_id"
                    class="w-full px-5 py-4 rounded-2xl border border-base-twee-100 bg-base-een-50 outline-none focus:border-primary-400 transition-all font-medium text-base-twee-700 appearance-none pointer-events-auto"
                  >
                    @for (type of roomTypes; track type.id) {
                    <option [value]="type.id">{{ type.type }}</option>
                    }
                  </select>
                </div>

                <div class="pt-4 mt-4 border-t border-dashed border-base-twee-100">
                  <label class="block text-[10px] font-black text-base-twee-600 uppercase mb-2 ml-1"
                    >Basishuur Prijs</label
                  >
                  <div class="relative group">
                    <span
                      class="absolute left-5 top-1/2 -translate-y-1/2 font-black text-xl text-primary-300"
                      >€</span
                    >
                    <input
                      type="number"
                      [(ngModel)]="room.price"
                      class="w-full pl-12 pr-6 py-5 rounded-3xl border-2 border-primary-100 bg-primary-50/20 font-black text-3xl text-primary-600 outline-none focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Tenant Management -->
            <div
              class="bg-white rounded-[32px] p-8 shadow-sm border border-base-twee-100 font-poppins relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h2 class="text-lg font-bold text-base-twee-900 mb-6 flex items-center gap-3">
                <span class="p-2 bg-base-een-100 rounded-lg text-base-twee-400 font-black text-xs"
                  >02</span
                >
                Huurder Status
              </h2>

              @if (activeTenant) {
              <div class="group relative bg-base-een-50 rounded-3xl p-6 border border-base-een-200">
                <div class="flex items-center gap-4 mb-4">
                  <div
                    class="h-12 w-12 rounded-full bg-white border-2 border-green-100 flex items-center justify-center text-green-500 font-bold"
                  >
                    {{ activeTenant.user?.fname?.[0] }}{{ activeTenant.user?.name?.[0] }}
                  </div>
                  <div>
                    <h3 class="font-bold text-base-twee-900 leading-tight">
                      {{ activeTenant.user?.fname }} {{ activeTenant.user?.name }}
                    </h3>
                    <p class="text-[10px] font-bold text-green-500 uppercase tracking-tight">
                      Contract Actief
                    </p>
                  </div>
                </div>
                <div class="space-y-2 mb-6">
                  <div class="flex justify-between text-[10px] text-base-twee-500 font-medium">
                    <span>E-mail</span>
                    <a [href]="'mailto:' + activeTenant.user?.email"
                      ><span class="text-primary-300 hover:underline">{{
                        activeTenant.user?.email
                      }}</span></a
                    >
                  </div>
                  <div class="flex justify-between text-[10px] text-base-twee-500 font-medium">
                    <span>Gsm nummer</span>
                    <a [href]="'tel:' + activeTenant.user?.phone"
                      ><span class="text-primary-300 hover:underline">{{
                        activeTenant.user?.phone
                      }}</span></a
                    >
                  </div>
                  <div class="flex justify-between text-[10px] text-base-twee-500 font-medium">
                    <span>Startdatum</span>
                    <span class="text-base-twee-700">{{
                      activeTenant.start_date | date : 'dd MMM yyyy'
                    }}</span>
                  </div>
                  @if (activeTenant.end_date) {
                  <div class="flex justify-between text-[10px] text-base-twee-500 font-medium">
                    <span>Einddatum</span>
                    <span class="text-base-twee-700">{{
                      activeTenant.end_date | date : 'dd MMM yyyy'
                    }}</span>
                  </div>
                  }
                </div>
                <div class="flex gap-2">
                  <!-- <button
                    class="flex-1 py-3 bg-white border border-base-twee-100 rounded-xl text-[10px] font-bold text-base-twee-600 hover:bg-base-twee-900 hover:text-white transition-all shadow-sm"
                  >
                    Dossier
                  </button> -->
                  <button
                    (click)="unlinkTenant()"
                    class="px-4 py-3 bg-white border border-red-100 rounded-xl text-[10px]  w-full font-bold text-red-400 hover:bg-red-500 hover:text-white cursor-pointer transition-all shadow-sm"
                  >
                    Ontkoppel
                  </button>
                </div>
              </div>
              } @else {
              <div class="space-y-4">
                @if (!selectedUser) {
                <div class="relative">
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (input)="searchTenant()"
                    placeholder="Zoek op naam of e-mail..."
                    class="w-full px-5 py-3 rounded-2xl border border-base-twee-100 bg-base-een-50 outline-none focus:border-primary-400 text-xs font-medium"
                  />
                  @if (searching) {
                  <div class="absolute right-4 top-1/2 -translate-y-1/2">
                    <span
                      class="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full block"
                    ></span>
                  </div>
                  }
                </div>

                @if (userSuggestions.length > 0) {
                <div
                  class="bg-white border border-base-twee-100 rounded-2xl shadow-xl overflow-hidden max-h-48 overflow-y-auto"
                >
                  @for (u of userSuggestions; track u.id) {
                  <button
                    (click)="selectTenant(u)"
                    class="w-full px-4 py-3 text-left hover:bg-base-een-50 flex flex-col gap-0.5 border-b border-base-een-100 last:border-0"
                  >
                    <span class="text-xs font-bold text-base-twee-900"
                      >{{ u.fname }} {{ u.name }}</span
                    >
                    <span class="text-[10px] text-base-twee-400">{{ u.email }}</span>
                  </button>
                  }
                </div>
                } @else if (searchQuery.length > 1 && !searching) {
                <p class="text-[10px] text-center text-base-twee-400 font-medium italic">
                  Geen huurders gevonden
                </p>
                } } @else {
                <!-- Selected User Confirmation -->
                <div class="bg-primary-50 rounded-3xl p-5 border border-primary-100">
                  <div class="flex items-center gap-3 mb-4">
                    <div
                      class="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary-600 font-bold border border-primary-200"
                    >
                      {{ selectedUser.fname?.[0] }}{{ selectedUser.name?.[0] }}
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-base-twee-900 truncate">
                        {{ selectedUser.fname }} {{ selectedUser.name }}
                      </p>
                      <p class="text-[10px] text-base-twee-500 truncate">
                        {{ selectedUser.email }}
                      </p>
                      <p class="text-[10px] text-base-twee-500 truncate">
                        {{ selectedUser.phone }}
                      </p>
                    </div>
                  </div>

                  <div class="mb-4">
                    <label
                      class="block text-[9px] font-black text-base-twee-400 uppercase mb-1 ml-1"
                      >Startdatum Contract</label
                    >
                    <input
                      type="date"
                      [(ngModel)]="linkingDate"
                      class="w-full px-4 py-2.5 rounded-xl border border-primary-200 bg-white outline-none focus:border-primary-500 text-xs font-bold text-primary-700"
                    />
                  </div>

                  <div class="mb-6">
                    <label
                      class="block text-[9px] font-black text-base-twee-400 uppercase mb-2 ml-1"
                      >Duur Contract (maanden)</label
                    >
                    <div class="grid grid-cols-3 gap-2">
                      @for (months of [9, 10, 11]; track months) {
                      <button
                        (click)="selectedDuration = months"
                        [class]="
                          selectedDuration === months
                            ? 'bg-primary-600 border-primary-600 text-white shadow-md'
                            : 'bg-white border-base-twee-100 text-base-twee-600 hover:border-primary-300'
                        "
                        class="py-2.5 border rounded-xl text-[10px] font-black transition-all"
                      >
                        {{ months }}m
                      </button>
                      }
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button
                      (click)="confirmLinkTenant()"
                      [disabled]="linking"
                      class="flex-1 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-700 transition-all disabled:opacity-50"
                    >
                      {{ linking ? 'Bezig...' : 'Bevestigen' }}
                    </button>
                    <button
                      (click)="cancelSelection()"
                      class="px-4 py-3 bg-white border border-base-twee-100 rounded-xl text-[10px] font-bold text-base-twee-400 hover:text-red-500 transition-all"
                    >
                      Annuleer
                    </button>
                  </div>
                </div>
                }

                <div class="text-center pt-2">
                  <p class="text-[9px] text-base-twee-300 font-bold uppercase tracking-widest">
                    Huurder moet een account hebben
                  </p>
                </div>
              </div>
              }
            </div>

            <!-- Extra Costs Breakdown -->
            <div
              class="bg-white rounded-[32px] p-8 shadow-sm border border-base-twee-100 font-poppins relative overflow-hidden"
            >
              <div class="absolute top-0 left-0 w-2 h-full bg-primary"></div>
              <h2 class="text-lg font-bold text-base-twee-900 mb-8 flex items-center gap-3">
                <span class="p-2 bg-base-een-100 rounded-lg text-base-twee-400 font-black text-xs"
                  >03</span
                >
                Kosten & Lasten
              </h2>

              <div class="space-y-10">
                <!-- Eenmalige Kosten -->
                <div class="space-y-4">
                  <h3 class="text-[9px] font-black text-accent uppercase tracking-widest ml-2">
                    Eenmalige Kosten
                  </h3>
                  <div class="space-y-3">
                    @for (cost of oneTimeCosts; track cost.id) {
                    <div
                      class="flex items-center justify-between p-4 bg-base-een-50 rounded-2xl border border-base-een-200 transition-all hover:bg-white hover:shadow-md group"
                    >
                      <div class="flex flex-col">
                        <span class="text-xs text-base-twee-700 font-black">{{ cost.name }}</span>
                        <span class="text-[8px] font-bold uppercase tracking-tight text-accent">
                          Eenmalig
                        </span>
                      </div>
                      <div class="relative w-28 drop-shadow-sm">
                        <span
                          class="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-base-twee-400 font-black"
                          >€</span
                        >
                        <input
                          type="number"
                          [ngModel]="getExtraCostsValue(cost.id)"
                          (ngModelChange)="setExtraCostsValue(cost.id, $event)"
                          class="w-full pl-8 pr-4 py-3 text-right text-sm font-black text-base-twee-900 bg-white border border-base-twee-100 rounded-xl outline-none group-hover:border-primary-400 transition-all"
                        />
                      </div>
                    </div>
                    }
                  </div>
                </div>

                <!-- Maandelijkse Kosten -->
                <div class="space-y-4">
                  <h3 class="text-[9px] font-black text-primary-500 uppercase tracking-widest ml-2">
                    Maandelijkse Kosten
                  </h3>
                  <div class="space-y-3">
                    @for (cost of monthlyCosts; track cost.id) {
                    <div
                      class="flex items-center justify-between p-4 bg-primary-50/30 rounded-2xl border border-primary-100/50 transition-all hover:bg-white hover:shadow-md group"
                    >
                      <div class="flex flex-col">
                        <span class="text-xs text-base-twee-700 font-black">{{ cost.name }}</span>
                        <span
                          class="text-[8px] font-bold uppercase tracking-tight text-primary-500"
                        >
                          Maandelijks
                        </span>
                      </div>
                      <div class="relative w-28 drop-shadow-sm">
                        <span
                          class="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] text-base-twee-400 font-black"
                          >€</span
                        >
                        <input
                          type="number"
                          [ngModel]="getExtraCostsValue(cost.id)"
                          (ngModelChange)="setExtraCostsValue(cost.id, $event)"
                          class="w-full pl-8 pr-4 py-3 text-right text-sm font-black text-base-twee-900 bg-white border border-base-twee-100 rounded-xl outline-none group-hover:border-primary-400 transition-all"
                        />
                      </div>
                    </div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN (Main Content) -->
          <div class="lg:col-span-8 space-y-8">
            <!-- Riche Text Description -->
            <div class="bg-white rounded-3xl p-6 shadow-sm border border-base-twee-100">
              <div class="flex items-center justify-between mb-8">
                <h2 class="text-2xl font-black text-base-twee-900 tracking-tight">
                  Kamerbeschrijving
                </h2>
              </div>
              <div class=" border-2 border-base-een-100 overflow-hidden">
                <quill-editor
                  [(ngModel)]="room.description"
                  [modules]="{
                    toolbar: [
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['clean']
                    ]
                  }"
                  class="block w-full h-full text-base-twee-600"
                  placeholder="Vertel toekomstige huurders over het licht, de meubels, de ligging..."
                ></quill-editor>
              </div>
            </div>

            <!-- Facilities Grid -->
            <div class="bg-white rounded-[40px] p-10 shadow-sm border border-base-twee-100">
              <div class="mb-10">
                <h2 class="text-2xl font-black text-base-twee-900 tracking-tight mb-2">
                  Aanwezige Faciliteiten
                </h2>
                <p class="text-sm text-base-twee-400 font-medium">
                  Klik op een faciliteit om deze aan of uit te zetten voor deze kamer.
                </p>
              </div>
              <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                @for (fac of allFacilities; track fac.id) {
                <button
                  (click)="toggleFacility(fac.id)"
                  [class]="
                    isFacilitySelected(fac.id)
                      ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 -translate-y-1'
                      : 'bg-white border-base-twee-100 text-base-twee-400 hover:border-primary-400 hover:text-primary-600'
                  "
                  class="flex flex-col items-center justify-center p-6 border-2 rounded-[32px] transition-all duration-300"
                >
                  <span class="text-[10px] font-black uppercase tracking-widest text-center">{{
                    fac.facility
                  }}</span>
                </button>
                }
              </div>
            </div>

            <!-- Media Section -->
            <div class="bg-white rounded-[40px] p-10 shadow-sm border border-base-twee-100">
              <h2 class="text-2xl font-black text-base-twee-900 tracking-tight mb-12">
                Media & Documenten
              </h2>

              <div class="space-y-16">
                <!-- COVER PHOTO -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                  <div class="md:col-span-1">
                    <h3
                      class="font-black text-base-twee-900 text-sm mb-2 uppercase tracking-widest"
                    >
                      Hoofdafbeelding
                    </h3>
                    <p class="text-xs text-base-twee-400 font-medium leading-relaxed">
                      Dit is de foto die mensen zien in de zoekresultaten. Zorg voor een heldere,
                      opgeruimde kamer.
                    </p>
                  </div>
                  <div class="md:col-span-2">
                    <div
                      (click)="mainImageInput.click()"
                      class="relative aspect-[16/9] rounded-[32px] border-4 border-dashed border-base-een-200 overflow-hidden cursor-pointer group hover:border-primary-400 transition-all bg-base-een-50"
                    >
                      @if (mainImage) {
                      <img
                        [src]="mainImage.file_path"
                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        class="absolute inset-0 bg-primary-600/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                      >
                        <span class="text-white font-black uppercase text-[10px] tracking-widest"
                          >Wijzigen</span
                        >
                      </div>
                      } @else {
                      <div
                        class="w-full h-full flex flex-col items-center justify-center text-base-twee-300 gap-4"
                      >
                        <svg
                          class="w-12 h-12"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span class="font-black text-[10px] uppercase tracking-widest"
                          >Upload Cover</span
                        >
                      </div>
                      }
                    </div>
                    <input
                      #mainImageInput
                      type="file"
                      (change)="onMainImageUpload($event)"
                      hidden
                      accept="image/*"
                    />
                  </div>
                </div>

                <!-- GALLERY -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div class="md:col-span-1">
                    <h3
                      class="font-black text-base-twee-900 text-sm mb-2 uppercase tracking-widest"
                    >
                      Foto Gallerij
                    </h3>
                    <p class="text-xs text-base-twee-400 font-medium leading-relaxed">
                      Voeg detailfoto's toe: de badkamer, het uitzicht, opbergruimte of de keuken.
                    </p>
                  </div>
                  <div class="md:col-span-2">
                    <div class="grid grid-cols-3 sm:grid-cols-4 gap-4">
                      @for (img of galleryImages; track img.id) {
                      <div
                        class="relative aspect-square rounded-[24px] overflow-hidden group border border-base-twee-100 shadow-sm"
                      >
                        <img
                          [src]="img.file_path"
                          class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                        />
                        <button
                          (click)="deleteFile(img.id)"
                          class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all shadow-lg active:scale-90"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                      }
                      <button
                        (click)="galInput.click()"
                        class="aspect-square rounded-[24px] border-4 border-dashed border-base-een-200 flex flex-col items-center justify-center gap-2 text-base-twee-300 hover:border-primary-400 hover:text-primary-500 transition-all bg-base-een-50"
                      >
                        <span class="text-2xl font-black">+</span>
                        <span class="text-[9px] font-black uppercase tracking-tight">Foto</span>
                      </button>
                    </div>
                    <input
                      #galInput
                      type="file"
                      (change)="onGalleryUpload($event)"
                      hidden
                      multiple
                      accept="image/*"
                    />
                  </div>
                </div>

                <!-- DOCUMENTS -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div class="md:col-span-1">
                    <h3
                      class="font-black text-base-twee-900 text-sm mb-2 uppercase tracking-widest"
                    >
                      Systeembestanden
                    </h3>
                    <p class="text-xs text-base-twee-400 font-medium leading-relaxed">
                      Beheer hier de juridische documenten zoals contracten en reglementen.
                    </p>
                  </div>
                  <div class="md:col-span-2">
                    <div class="bg-base-een-50 p-6 rounded-[32px] border border-base-een-200">
                      <div class="flex gap-4 mb-6">
                        <select
                          [(ngModel)]="selectedDocTypeId"
                          class="flex-1 px-5 py-4 rounded-2xl bg-white border border-base-twee-100 text-xs font-bold text-base-twee-700 outline-none focus:border-primary-400 shadow-sm appearance-none"
                        >
                          @for (docType of allowedDocTypes; track docType.id) {
                          <option [value]="docType.id">{{ docType.name }}</option>
                          }
                        </select>
                        <button
                          (click)="docInput.click()"
                          class="px-8 bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:shadow-primary-100 transition-all active:scale-95"
                        >
                          Upload
                        </button>
                        <input #docInput type="file" (change)="onDocumentUpload($event)" hidden />
                      </div>

                      <div class="space-y-3">
                        @for (doc of roomDocuments; track doc.id) {
                        <div
                          class="flex items-center justify-between p-4 bg-white rounded-2xl border border-base-twee-50 shadow-sm group"
                        >
                          <div class="flex items-center gap-3 overflow-hidden">
                            <div class="p-2 bg-primary-50 text-primary-600 rounded-lg">
                              <svg
                                class="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div class="flex flex-col">
                              <span
                                class="text-[10px] font-black text-base-twee-900 truncate max-w-[200px]"
                                >{{ doc.name }}</span
                              >
                              <span
                                class="text-[8px] font-bold text-base-twee-400 uppercase tracking-tighter"
                              >
                                {{ getDocTypeName(doc.document_type_id) }}
                              </span>
                            </div>
                          </div>
                          <button
                            (click)="deleteFile(doc.id)"
                            class="p-2 text-base-twee-300 hover:text-red-500 transition-colors"
                          >
                            <svg
                              class="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                        } @if (roomDocuments.length === 0) {
                        <div
                          class="text-center py-6 text-[10px] font-black text-base-twee-300 uppercase tracking-widest border-2 border-dashed border-base-twee-100 rounded-2xl"
                        >
                          Nog geen documenten
                        </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
  styles: [],
})
export class RoomEditing implements OnInit {
  room: any = null;
  roomTypes: any[] = [];
  allExtraCosts: any[] = [];
  allFacilities: any[] = [];
  loading = false;
  saving = false;

  // Tenant Search
  searchQuery: string = '';
  userSuggestions: any[] = [];
  selectedUser: any = null;
  linkingDate: string = new Date().toISOString().split('T')[0];
  selectedDuration: number = 10; // Standaard 10 maanden
  searching: boolean = false;
  linking: boolean = false;

  allowedDocTypes = [
    { id: 1, name: 'Huurcontract' },
    { id: 3, name: 'Huishoudelijk Reglement' },
    { id: 4, name: 'Brandverzekering' },
    { id: 5, name: 'EPC Attest' },
  ];
  selectedDocTypeId: number = 1;

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
      const [types, room, costs, facs] = await Promise.all([
        this.verhuurderService.getRoomTypes(),
        this.verhuurderService.getRoom(id),
        this.verhuurderService.getExtraCosts(),
        this.verhuurderService.getFacilities(),
      ]);
      this.roomTypes = types;
      this.room = room;
      this.allExtraCosts = costs;
      this.allFacilities = facs;

      if (!this.room.extra_costs) this.room.extra_costs = [];
      if (!this.room.facilities) this.room.facilities = [];
    } catch (error) {
      console.error(error);
      alert('Laden mislukt.');
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  // Getter for active tenant
  get activeTenant() {
    return (
      this.room?.active_contract ||
      this.room?.contracts?.find((c: any) => c.is_active == 1 || c.is_active == true) ||
      null
    );
  }

  // Tenant Search & Linking
  async searchTenant() {
    if (this.searchQuery.length < 2) {
      this.userSuggestions = [];
      return;
    }
    this.searching = true;
    try {
      this.userSuggestions = await this.verhuurderService.searchUsers(this.searchQuery);
    } catch (e) {
      console.error(e);
    } finally {
      this.searching = false;
      this.cdr.detectChanges();
    }
  }

  selectTenant(user: any) {
    this.selectedUser = user;
    this.userSuggestions = [];
    this.searchQuery = '';
    this.cdr.detectChanges();
  }

  cancelSelection() {
    this.selectedUser = null;
    this.cdr.detectChanges();
  }

  async confirmLinkTenant() {
    if (!this.selectedUser || !this.room) return;
    this.linking = true;
    try {
      // Bereken einddatum
      const startDate = new Date(this.linkingDate);
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + Number(this.selectedDuration));
      const endDateStr = endDate.toISOString().split('T')[0];

      await this.verhuurderService.linkTenant(
        this.room.id,
        this.selectedUser.id,
        this.linkingDate,
        endDateStr
      );
      this.room = await this.verhuurderService.getRoom(this.room.id);
      this.selectedUser = null;
      alert('Huurder succesvol gekoppeld!');
    } catch (e) {
      console.error(e);
      alert('Linken mislukt.');
    } finally {
      this.linking = false;
      this.cdr.detectChanges();
    }
  }

  async unlinkTenant() {
    if (!this.room || !confirm('Weet u zeker dat u deze huurder wilt ontkoppelen?')) return;
    try {
      await this.verhuurderService.unlinkTenant(this.room.id);
      this.room = await this.verhuurderService.getRoom(this.room.id);
      alert('Huurder ontkoppeld.');
    } catch (e) {
      console.error(e);
      alert('Ontkoppelen mislukt.');
    } finally {
      this.cdr.detectChanges();
    }
  }

  get oneTimeCosts() {
    return this.allExtraCosts.filter((c: any) => !c.is_recurring);
  }

  get monthlyCosts() {
    return this.allExtraCosts.filter((c: any) => c.is_recurring);
  }

  getExtraCostsValue(id: number) {
    const cost = this.room?.extra_costs?.find((c: any) => c.id === id);
    return cost ? cost.pivot?.price || cost.price || 0 : 0;
  }

  setExtraCostsValue(id: number, value: any) {
    if (!this.room.extra_costs) this.room.extra_costs = [];
    const price = Number(value);
    let cost = this.room.extra_costs.find((c: any) => c.id === id);
    if (cost) {
      if (!cost.pivot) cost.pivot = {};
      cost.pivot.price = price;
      cost.price = price;
    } else {
      this.room.extra_costs.push({ id, price, pivot: { price } });
    }
  }

  isFacilitySelected(id: number) {
    return this.room?.facilities?.some((f: any) => f.id === id);
  }

  toggleFacility(id: number) {
    if (!this.room.facilities) this.room.facilities = [];
    const index = this.room.facilities.findIndex((f: any) => f.id === id);
    if (index > -1) {
      this.room.facilities.splice(index, 1);
    } else {
      this.room.facilities.push({ id });
    }
    this.cdr.detectChanges();
  }

  get mainImage() {
    return this.room?.documents?.find((i: any) => i.document_type_id === 7);
  }
  get galleryImages() {
    return this.room?.documents?.filter((i: any) => i.document_type_id === 9) || [];
  }
  get roomDocuments() {
    const ids = this.allowedDocTypes.map((t) => t.id);
    return this.room?.documents?.filter((i: any) => ids.includes(i.document_type_id)) || [];
  }

  getDocTypeName(id: number) {
    return this.allowedDocTypes.find((t) => t.id === id)?.name || 'Bestand';
  }

  async saveRoom() {
    this.saving = true;
    try {
      await this.verhuurderService.updateRoom(this.room.id, {
        ...this.room,
        extra_costs: this.room.extra_costs.map((c: any) => ({
          id: c.id,
          price: c.pivot?.price || c.price || 0,
        })),
        facilities: this.room.facilities.map((f: any) => f.id),
      });
      alert('Kamer succesvol bijgewerkt!');
      this.room = await this.verhuurderService.getRoom(this.room.id);
    } catch (e) {
      console.error(e);
      alert('Fout bij opslaan.');
    } finally {
      this.saving = false;
      this.cdr.detectChanges();
    }
  }

  async onMainImageUpload(ev: any) {
    const file = ev.target.files[0];
    if (file) {
      await this.verhuurderService.uploadRoomImage(this.room.id, file, 7);
      this.room = await this.verhuurderService.getRoom(this.room.id);
    }
    this.cdr.detectChanges();
  }

  async onGalleryUpload(ev: any) {
    const files = ev.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        await this.verhuurderService.uploadRoomImage(this.room.id, files[i], 9);
      }
      this.room = await this.verhuurderService.getRoom(this.room.id);
    }
    this.cdr.detectChanges();
  }

  async onDocumentUpload(ev: any) {
    const files = ev.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        await this.verhuurderService.uploadRoomImage(
          this.room.id,
          files[i],
          Number(this.selectedDocTypeId)
        );
      }
      this.room = await this.verhuurderService.getRoom(this.room.id);
    }
    this.cdr.detectChanges();
  }

  async deleteFile(id: number) {
    if (confirm('U staat op het punt dit bestand permanent te verwijderen. Doorgaan?')) {
      await this.verhuurderService.deleteImage(id);
      this.room = await this.verhuurderService.getRoom(this.room.id);
    }
    this.cdr.detectChanges();
  }
}
