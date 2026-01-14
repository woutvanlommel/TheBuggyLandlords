import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div id="mainDashboardId" class="bg-primary min-h-screen w-full pb-10">
      <div class="w-full px-6 pt-6">
        <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 class="text-base-twee text-4xl">Dashboard</h1>
          <div class="flex items-center gap-3">
            <button
              type="button"
              routerLink="/kotcompass/zoekplatform"
              class="px-4 py-2 rounded-full bg-secondary text-base-een-100 font-semibold shadow hover:bg-secondary-600 transition-colors">
              KotCompass
            </button>
            <button
              type="button"
              (click)="onLogout()"
              class="px-4 py-2 rounded-full bg-base-een-100/70 border border-base-twee-200 text-base-twee-900 font-semibold shadow hover:bg-base-een-200 transition-colors">
              Log off
            </button>
          </div>
        </div>
      </div>
      <main class="relative z-20 w-full">
        <div class="relative z-30 -mb-px px-5">
        <div class="grid grid-cols-3 gap-2 w-full">

          <a
            (click)="setActiveTab('dashboard')"
            [ngClass]="activeTab === 'dashboard'
              ? 'bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0'
              : 'text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer'"
            class="px-6 py-2.5 font-semibold text-sm w-full block text-center">
            Dashboard
          </a>

          <a
            (click)="setActiveTab('profile')"
            [ngClass]="activeTab === 'profile'
              ? 'bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0'
              : 'text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer'"
            class="px-6 py-2.5 font-semibold text-sm w-full block text-center">
            Profiel
          </a>

          <a
            (click)="setActiveTab('credits')"
            [ngClass]="activeTab === 'credits'
              ? 'bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0'
              : 'text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer'"
            class="px-6 py-2.5 font-semibold text-sm w-full block text-center">
            Credits
          </a>

        </div>
        </div>

        <section class="bg-base-een-100/60 backdrop-blur-md border border-base-twee-300/50 shadow-2xl rounded-3xl p-6 space-y-6 relative z-20">

          <div *ngIf="activeTab === 'dashboard'">
            <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl">
                <p class="text-xs font-semibold tracking-wide text-primary-600">Totaal Credits</p>
                <div class="mt-1 mb-3 flex items-center justify-between">
                  <span class="text-2xl font-bold text-base-twee-900">--</span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-secondary-200/50 text-secondary-900">--%</span>
                </div>
                <div class="w-full h-2 rounded-full bg-base-een-300 overflow-hidden">
                  <span class="block h-full rounded-full bg-linear-to-r from-primary-500 to-primary-600" style="width:60%"></span>
                </div>
              </article>

              <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl">
                <p class="text-xs font-semibold tracking-wide text-primary-600">Actieve Spotlights</p>
                <div class="mt-1 mb-3 flex items-center justify-between">
                  <span class="text-2xl font-bold text-base-twee-900">--</span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-base-een-300/50 text-base-twee-900">--</span>
                </div>
                <div class="flex gap-1">
                   <div class="h-2 w-8 rounded-full bg-secondary-500"></div>
                   <div class="h-2 w-2 rounded-full bg-secondary-200"></div>
                </div>
              </article>

              <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl">
                <p class="text-xs font-semibold tracking-wide text-primary-600">Spotlight Views</p>
                <div class="mt-1 mb-3 flex items-center justify-between">
                  <span class="text-2xl font-bold text-base-twee-900">--</span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-secondary-200/50 text-secondary-900">--%</span>
                </div>
                <div class="h-12">
                   <svg viewBox="0 0 120 40" fill="none" stroke-width="3" class="w-full h-full opacity-50">
                    <path d="M5 30 L30 18 L55 26 L80 12 L115 22" stroke="currentColor" class="text-primary-500" />
                  </svg>
                </div>
              </article>

              <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl">
                <p class="text-xs font-semibold tracking-wide text-primary-600">Credits Verbruikt</p>
                <div class="mt-1 mb-3 flex items-center justify-between">
                  <span class="text-2xl font-bold text-base-twee-900">--</span>
                  <span class="px-3 py-1 text-xs font-semibold rounded-full bg-accent-200/50 text-accent-900">--%</span>
                </div>
                 <div class="w-full h-2 rounded-full bg-base-een-300 overflow-hidden">
                  <span class="block h-full rounded-full bg-linear-to-r from-accent-400 to-accent-500" style="width:30%"></span>
                </div>
              </article>
            </section>

            <section class="grid grid-cols-12 gap-4">
              <article class="col-span-12 lg:col-span-8 bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl h-full">
                <div class="flex items-center justify-between gap-3 mb-4">
                  <div>
                    <p class="text-xs font-semibold tracking-wide text-primary-600">Overzicht</p>
                    <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Studenten per Kot</h3>
                  </div>
                  <button class="px-3 py-2 rounded-xl bg-base-een-100/50 backdrop-blur-sm text-base-twee-900 border border-base-twee-200 shadow hover:bg-white/80 transition-colors">Beheer</button>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-sm text-base-twee-700">
                        <thead class="text-xs uppercase text-base-twee-500 font-semibold border-b border-base-twee-200/50">
                            <tr>
                                <th class="px-4 py-3">Student</th>
                                <th class="px-4 py-3">Kot / Kamer</th>
                                <th class="px-4 py-3">Status</th>
                                <th class="px-4 py-3 text-right">Actie</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-base-twee-200/50">
                            <tr class="hover:bg-base-een-200/30 transition-colors">
                                <td class="px-4 py-3 font-medium text-base-twee-900">--</td>
                                <td class="px-4 py-3">--</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 rounded-full bg-secondary-100/50 text-secondary-900 text-xs font-semibold">Actief</span></td>
                                <td class="px-4 py-3 text-right text-primary-600 cursor-pointer hover:underline">Details</td>
                            </tr>
                            <tr class="hover:bg-base-een-200/30 transition-colors">
                                <td class="px-4 py-3 font-medium text-base-twee-900">--</td>
                                <td class="px-4 py-3">--</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 rounded-full bg-accent-100/50 text-accent-900 text-xs font-semibold">Te laat</span></td>
                                <td class="px-4 py-3 text-right text-primary-600 cursor-pointer hover:underline">Details</td>
                            </tr>
                             <tr class="hover:bg-base-een-200/30 transition-colors">
                                <td class="px-4 py-3 font-medium text-base-twee-900">--</td>
                                <td class="px-4 py-3">--</td>
                                <td class="px-4 py-3"><span class="px-2 py-1 rounded-full bg-secondary-100/50 text-secondary-900 text-xs font-semibold">Actief</span></td>
                                <td class="px-4 py-3 text-right text-primary-600 cursor-pointer hover:underline">Details</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
              </article>

              <div class="col-span-12 lg:col-span-4 flex flex-col gap-4">
                 <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl">
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p class="text-xs font-semibold tracking-wide text-primary-600">Communicatie</p>
                      <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Bericht Uitsturen</h3>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <input type="text" placeholder="Onderwerp" class="w-full px-4 py-2 rounded-xl bg-base-een-100/50 border border-base-twee-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-base-twee-400">
                    <textarea placeholder="Typ hier je bericht..." rows="3" class="w-full px-4 py-2 rounded-xl bg-base-een-100/50 border border-base-twee-300/50 focus:outline-none focus:ring-2 focus:ring-primary-400 placeholder:text-base-twee-400"></textarea>
                    <button class="w-full py-2 rounded-xl bg-primary text-base-een-100 font-semibold shadow hover:bg-primary-600 transition-colors">Verstuur</button>
                  </div>
                </article>

                <article class="bg-base-een-100/50 backdrop-blur-sm border border-primary-100/50 rounded-2xl p-5 shadow-xl flex-1">
                  <div class="flex items-center justify-between gap-3 mb-3">
                    <div>
                      <p class="text-xs font-semibold tracking-wide text-primary-600">Updates</p>
                      <h3 class="mt-1 text-lg font-semibold text-base-twee-900">Mededelingen</h3>
                    </div>
                    <button class="px-3 py-2 rounded-xl bg-base-een-100/50 backdrop-blur-sm text-base-twee-900 border border-base-twee-200 shadow text-xs">Alles</button>
                  </div>
                  <ul class="flex flex-col gap-3 text-base-twee-900">
                    <li class="flex items-start gap-3 bg-base-een-100/30 p-2 rounded-lg"><span class="mt-1.5 w-2 h-2 rounded-full bg-secondary-500 shrink-0"></span><span class="text-sm">--</span></li>
                    <li class="flex items-start gap-3 bg-base-een-100/30 p-2 rounded-lg"><span class="mt-1.5 w-2 h-2 rounded-full bg-base-twee-400 shrink-0"></span><span class="text-sm">--</span></li>
                    <li class="flex items-start gap-3 bg-base-een-100/30 p-2 rounded-lg"><span class="mt-1.5 w-2 h-2 rounded-full bg-accent-500 shrink-0"></span><span class="text-sm">--</span></li>
                  </ul>
                </article>
              </div>
            </section>
          </div>

          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [``],
})
export class Dashboard implements OnInit {
  activeTab: string = 'dashboard';

  // 2. Inject ActivatedRoute
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // 3. LISTEN TO URL CHANGES (This fixes the navigation bug)
    this.route.queryParams.subscribe(params => {
      if (this.router.url.includes('profile')) {
        this.activeTab = 'profile';
      } else if (this.router.url.includes('credits')) {
        this.activeTab = 'credits';
      } else {
        this.activeTab = 'dashboard';
      }
    });
  }

  // 4. Update the helper to navigate instead of just setting a variable
  setActiveTab(tab: string) {
    if (tab === 'dashboard') {
      this.router.navigate(['/dashboard']);
    } else if (tab === 'profile') {
      this.router.navigate(['/dashboard/profile']);
    } else if (tab === 'credits') {
      this.router.navigate(['/dashboard/credits']);
    }
  }

  onLogout() {
    this.authService.logout().finally(() => this.router.navigate(['/login']));
  }
}
