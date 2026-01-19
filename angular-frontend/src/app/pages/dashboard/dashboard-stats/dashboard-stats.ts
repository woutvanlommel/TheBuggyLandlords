import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BuildingDashboard } from '../../../components/building-dashboard/building-dashboard';
import { VerhuurderService } from '../../../shared/verhuurder.service';
import { CreditService } from '../../../shared/credit.service';

@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule, BuildingDashboard, RouterModule],
  standalone: true,
  template: ` <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      
      <!-- Total Credits Card -->
      <article
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-primary">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>

        <div class="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Beschikbare Credits</p>
              <div class="flex items-baseline gap-2">
                <span class="text-4xl font-extrabold text-primary-900">{{ totalCredits }}</span>
                <span class="text-sm text-gray-400 font-medium">credits</span>
              </div>
            </div>

            <div class="mt-6">
              <a
                routerLink="../credits"
                class="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:text-accent-600 transition-colors group-hover:gap-2"
              >
                Opwaarderen <span class="transition-all">&rarr;</span>
              </a>
            </div>
        </div>
      </article>

      <!-- Active Spotlights Card -->
      <article
        *ngIf="isLandlord"
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
      >
        <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-24 h-24 text-secondary">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
        </div>

        <div class="relative z-10">
            <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Actieve Spotlights</p>
            <div class="flex items-center justify-between mb-4">
              <span class="text-4xl font-extrabold text-gray-900">{{ activeSpotlights }}</span>
              <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-secondary-50 text-secondary-700 border border-secondary-100">
                Live
              </span>
            </div>
            
            <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <span
                class="block h-full rounded-full bg-secondary-500 transition-all duration-1000 ease-out"
                [style.width.%]="spotlightPercentage"
              ></span>
            </div>
        </div>
      </article>

      <!-- Views Card (Placeholder) -->
      <article
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Totaal Views</p>
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl font-extrabold text-gray-300">--</span>
          <span class="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-50 text-gray-400 border border-gray-100">
            +0%
          </span>
        </div>
        <!-- Simple Sparkline SVG -->
        <div class="h-10 w-full opacity-30 group-hover:opacity-50 transition-opacity">
            <svg viewBox="0 0 100 30" preserveAspectRatio="none" class="w-full h-full stroke-gray-400 fill-none stroke-2">
                <path d="M0 25 Q 10 20, 20 22 T 40 15 T 60 20 T 80 5 T 100 15" vector-effect="non-scaling-stroke" />
            </svg>
        </div>
      </article>

      <!-- Usage Card (Placeholder) -->
      <article
        class="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
      >
        <p class="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Gebruik</p>
        <div class="flex items-center justify-between mb-4">
          <span class="text-4xl font-extrabold text-gray-300">--</span>
        </div>
        <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <span
            class="block h-full rounded-full bg-gray-300"
            style="width: 0%"
          ></span>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-12 gap-6 relative">
      <article
        class="col-span-12 lg:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 min-h-400px"
      >

        <app-building-dashboard></app-building-dashboard>
      </article>

      <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
        <article
          class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl"
        >
          <div class="flex items-center justify-between gap-3 mb-3">
            <div>
              <p class="text-xs font-semibold tracking-wide text-primary-600">Communicatie</p>
              <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Bericht Uitsturen</h3>
            </div>
          </div>
          <div class="space-y-3">
            <input
              type="text"
              placeholder="Onderwerp"
              class="w-full px-4 py-2 rounded-xl bg-base-een-100/50 border border-base-twee-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-base-twee-400"
            />
            <textarea
              placeholder="Typ hier je bericht..."
              rows="3"
              class="w-full px-4 py-2 rounded-xl bg-base-een-100/50 border border-base-twee-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-base-twee-400"
            ></textarea>
            <button
              class="w-full py-2 rounded-xl bg-primary text-base-een-100 font-semibold shadow hover:bg-primary-600 transition-colors"
            >
              Verstuur
            </button>
          </div>
        </article>

        <article
          class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl flex-1"
        >
          <div class="flex items-center justify-between gap-3 mb-3">
            <div>
              <p class="text-xs font-semibold tracking-wide text-primary-600">Updates</p>
              <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Mededelingen</h3>
            </div>
            <button
              class="px-3 py-2 rounded-xl bg-base-een-100/50 backdrop-blur-sm text-base-twee-900 border border-base-twee-200 shadow text-xs"
            >
              Alles
            </button>
          </div>
          <ul class="flex flex-col gap-3 text-base-twee-900">
            <li class="flex items-start gap-3 bg-base-een-100/30 p-2 rounded-lg">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-secondary-500 shrink-0"></span
              ><span class="text-sm">--</span>
            </li>
            <li class="flex items-start gap-3 bg-base-een-100/30 p-2 rounded-lg">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-base-twee-400 shrink-0"></span
              ><span class="text-sm">--</span>
            </li>
            <li class="flex items-start gap-3 bg-base-een-100/30 p-2 rounded-lg">
              <span class="mt-1.5 w-2 h-2 rounded-full bg-accent-500 shrink-0"></span
              ><span class="text-sm">--</span>
            </li>
          </ul>
        </article>
      </div>
    </section>`,
})
export class DashboardStats implements OnInit {
  totalCredits: number = 0;
  activeSpotlights: number = 0;
  totalRooms: number = 0;
  spotlightPercentage: number = 0;
  isLandlord: boolean = false;

  constructor(
    private creditService: CreditService,
    private verhuurderService: VerhuurderService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Check role immediately for UI visibility
    const role = sessionStorage.getItem('user_role');
    this.isLandlord = !!role && role.toLowerCase() === 'verhuurder';

    this.creditService.refreshBalance();
    this.creditService.balance$.subscribe((b) => {
      this.totalCredits = b;
      this.cdr.markForCheck();
    });

    // Only load stats if landlord
    if (this.isLandlord) {
      this.loadStats();
    }
  }

  async loadStats() {
    try {
      const buildings = await this.verhuurderService.getMyBuildings();
      let activeCount = 0;
      let roomCount = 0;

      buildings.forEach((b: any) => {
        if (b.rooms) {
          b.rooms.forEach((r: any) => {
            roomCount++;
            // Use the 'is_highlighted' flag directly as requested (1 = active)
            if (r.is_highlighted) {
              activeCount++;
            }
          });
        }
      });

      this.activeSpotlights = activeCount;
      this.totalRooms = roomCount;
      // Calculate percentage for the bar (cap at 100%)
      this.spotlightPercentage = roomCount > 0 ? Math.min((activeCount / roomCount) * 100, 100) : 0;

      this.cdr.detectChanges(); // Force update after stats calculation
    } catch (e) {
      console.error('Failed to load stats', e);
    }
  }
}
