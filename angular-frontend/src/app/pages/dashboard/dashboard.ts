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
              (click)="setActiveTab('dashboard')"
              [ngClass]="
                activeTab === 'dashboard'
                  ? 'bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0'
                  : 'text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer'
              "
              class="px-6 py-2.5 font-semibold text-sm w-full block text-center"
            >
              Dashboard
            </a>

            <a
              (click)="setActiveTab('profile')"
              [ngClass]="
                activeTab === 'profile'
                  ? 'bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0'
                  : 'text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer'
              "
              class="px-6 py-2.5 font-semibold text-sm w-full block text-center"
            >
              Profiel
            </a>

            <a
              (click)="setActiveTab('credits')"
              [ngClass]="
                activeTab === 'credits'
                  ? 'bg-base-een-100/60 backdrop-blur-md border-t border-x border-base-twee-300/50 text-base-twee-900 rounded-t-2xl border-b-0'
                  : 'text-base-twee-600 hover:text-base-twee-900 hover:bg-base-een-200/30 rounded-t-2xl transition-all cursor-pointer'
              "
              class="px-6 py-2.5 font-semibold text-sm w-full block text-center"
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

  // 2. Inject ActivatedRoute
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
  // A. Run immediately on load to set the correct tab
  this.updateTabFromUrl();

  // B. Listen for FUTURE navigation changes
  this.router.events.pipe(
    filter(event => event instanceof NavigationEnd) // Only trigger when navigation finishes
  ).subscribe(() => {
    this.updateTabFromUrl(); // Update the tab again
  });
}

// Helper function to keep logic clean
updateTabFromUrl() {
  const currentUrl = this.router.url;

  if (currentUrl.includes('/credits')) {
    this.activeTab = 'credits';
  }
  else if (currentUrl.includes('/profile')) {
    this.activeTab = 'profile';
  }
  else {
    // If it's not profile or credits, it must be the main dashboard/stats
    this.activeTab = 'dashboard';
  }
}

  // 4. Update the helper to navigate instead of just setting a variable
  setActiveTab(tab: string) {
    if (tab === 'dashboard') {
      this.router.navigate(['/dashboard/stats']);
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
