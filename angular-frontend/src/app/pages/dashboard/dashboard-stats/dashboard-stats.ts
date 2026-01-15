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
  template: ` <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      <article
        class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between"
      >
        <div>
           <p class="text-xs font-semibold tracking-wide text-primary-600">Totaal Credits</p>
           <div class="mt-2 flex items-baseline gap-2">
             <span class="text-3xl font-bold text-base-twee-900">{{ totalCredits }}</span>
             <span class="text-sm text-base-twee-500 font-medium">available</span>
           </div>
        </div>
        
        <div class="mt-4">
           <a routerLink="../credits" class="inline-flex items-center text-xs font-bold text-primary-700 hover:text-primary-900 hover:underline transition-all cursor-pointer">
              Top up balance &rarr;
           </a>
        </div>
      </article>

      <article
        *ngIf="isLandlord"
        class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl"
      >
        <p class="text-xs font-semibold tracking-wide text-primary-600">Actieve Spotlights</p>
        <div class="mt-1 mb-3 flex items-center justify-between">
          <span class="text-2xl font-bold text-base-twee-900">{{ activeSpotlights }}</span>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full bg-base-een-300/50 text-base-twee-900"
            >Properties</span
          >
        </div>
        <!-- Progress Bar representing % of total properties spotlighted -->
        <div class="w-full h-2 rounded-full bg-base-een-300 overflow-hidden">
          <span
            class="block h-full rounded-full bg-linear-to-r from-secondary-400 to-secondary-500 transition-all duration-500"
            [style.width.%]="spotlightPercentage"
          ></span>
        </div>
      </article>

      <article
        class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl"
      >
        <p class="text-xs font-semibold tracking-wide text-primary-600">Spotlight Views</p>
        <div class="mt-1 mb-3 flex items-center justify-between">
          <span class="text-2xl font-bold text-base-twee-900">--</span>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full bg-secondary-200/50 text-secondary-900"
            >--%</span
          >
        </div>
        <div class="h-12">
          <svg viewBox="0 0 120 40" fill="none" stroke-width="3" class="w-full h-full opacity-50">
            <path
              d="M5 30 L30 18 L55 26 L80 12 L115 22"
              stroke="currentColor"
              class="text-primary-500"
            />
          </svg>
        </div>
      </article>

      <article
        class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl"
      >
        <p class="text-xs font-semibold tracking-wide text-primary-600">Credits Verbruikt</p>
        <div class="mt-1 mb-3 flex items-center justify-between">
          <span class="text-2xl font-bold text-base-twee-900">--</span>
          <span
            class="px-3 py-1 text-xs font-semibold rounded-full bg-accent-200/50 text-accent-900"
            >--%</span
          >
        </div>
        <div class="w-full h-2 rounded-full bg-base-een-300 overflow-hidden">
          <span
            class="block h-full rounded-full bg-linear-to-r from-accent-400 to-accent-500"
            style="width:30%"
          ></span>
        </div>
      </article>
    </section>

    <section class="grid grid-cols-12 gap-4">
      <article
        class="col-span-12 lg:col-span-8 bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl h-full"
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
