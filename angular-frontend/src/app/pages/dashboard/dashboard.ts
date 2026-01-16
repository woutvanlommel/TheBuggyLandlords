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
    <div id="mainDashboardId" class="min-h-screen w-full bg-base-een-100 font-sans pb-20">
      
      <!-- Top Header Area -->
      <div class="w-full bg-white shadow-sm border-b border-gray-200">
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            <!-- Title Section -->
            <div>
              <h1 class="text-3xl md:text-4xl font-bold text-primary-900 tracking-tight">
                Mijn <span class="text-accent">Dashboard</span>
              </h1>
              <p class="text-base-twee-600 mt-1">Beheer je profiel, bekijk statistieken en regel je credits.</p>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center gap-3">
              <button
                type="button"
                routerLink="/kotcompass/zoekplatform"
                class="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-white border border-base-twee-200 text-primary-700 font-semibold shadow-sm hover:bg-primary-50 hover:border-primary-100 hover:shadow-md transition-all duration-300 gap-2 group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 group-hover:scale-110 transition-transform">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                Naar KotCompass
              </button>
              
              <button
                type="button"
                (click)="onLogout()"
                class="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-red-50 text-red-600 font-semibold border border-red-100 shadow-sm hover:bg-red-100 hover:shadow-md transition-all duration-300 gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                </svg>
                Afmelden
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Container Center -->
      <main class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        <!-- Navigation Tabs (Pill Style) -->
        <div class="flex justify-center mb-8">
            <div class="inline-flex p-1.5 bg-white rounded-full shadow-sm border border-gray-200 gap-1 overflow-x-auto max-w-full">
                <a
                  routerLink="stats"
                  routerLinkActive="bg-primary text-white shadow-md"
                  [routerLinkActiveOptions]="{exact: true}"
                  class="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:text-primary-700 hover:bg-gray-50 transition-all duration-200 whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  Statistieken
                </a>

                <a
                  routerLink="profile"
                  routerLinkActive="bg-primary text-white shadow-md"
                  class="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:text-primary-700 hover:bg-gray-50 transition-all duration-200 whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  Profiel
                </a>

                <a
                  routerLink="credits"
                  routerLinkActive="bg-primary text-white shadow-md"
                  class="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-gray-500 hover:text-primary-700 hover:bg-gray-50 transition-all duration-200 whitespace-nowrap"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Credits
                </a>
            </div>
        </div>

        <!-- router Outlet Card -->
        <section
          class="bg-white border border-gray-200 shadow-xl rounded-3xl p-6 md:p-10 min-h-100 animate-fade-in"
        >
          <router-outlet></router-outlet>
        </section>
      </main>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.4s ease-out forwards;
    }
  `],
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