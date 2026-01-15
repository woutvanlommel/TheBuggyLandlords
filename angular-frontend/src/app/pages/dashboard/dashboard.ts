import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { filter } from 'rxjs/operators';

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
              class="px-4 py-2 rounded-full bg-secondary text-base-een-100 font-semibold shadow hover:bg-secondary-600 transition-colors"
            >
              KotCompass
            </button>
            <button
              type="button"
              (click)="onLogout()"
              class="px-4 py-2 rounded-full bg-base-een-100/70 border border-base-twee-200 text-base-twee-900 font-semibold shadow hover:bg-base-een-200 transition-colors"
            >
              Log off
            </button>
          </div>
        </div>
      </div>
      <main class="relative z-20 w-full">
        <div class="relative z-30 -mb-px px-5">
          <div class="grid grid-cols-3 gap-2 w-full">
            <a
              routerLink="stats"
              routerLinkActive="bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0"
              [routerLinkActiveOptions]="{exact: true}"
              class="px-6 py-2.5 font-semibold text-sm w-full block text-center text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer overflow-hidden z-10"
            >
              Dashboard
            </a>

            <a
              routerLink="profile"
              routerLinkActive="bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0"
              class="px-6 py-2.5 font-semibold text-sm w-full block text-center text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer overflow-hidden z-10"
            >
              Profiel
            </a>

            <a
              routerLink="credits"
              routerLinkActive="bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0"
              class="px-6 py-2.5 font-semibold text-sm w-full block text-center text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer overflow-hidden z-10"
            >
              Credits
            </a>
          </div>
        </div>

        <section
          class="bg-base-een-100/60 backdrop-blur-md border border-base-twee-300/50 shadow-2xl rounded-3xl p-6 space-y-6 relative z-20"
        >
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [``],
})
export class Dashboard implements OnInit {
  activeTab: string = 'dashboard';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}