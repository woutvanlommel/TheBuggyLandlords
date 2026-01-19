import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  standalone: true,
  template: `
    <nav class="bg-white/95 backdrop-blur-md sticky top-0 z-50 w-full shadow-sm border-b border-base-twee-100 transition-all duration-300">
      <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-row justify-between items-center h-20">
            <!-- Logo -->
            <div class="shrink-0 flex items-center">
              <a routerLink="/kotcompass/zoekplatform" class="flex items-center gap-2 group">
                <img
                  src="/assets/logo/1.400pxX100pxLogoLiggendOranje.png"
                  alt="KotCompass Logo"
                  class="hidden sm:block h-12 w-auto transition-transform duration-300 group-hover:scale-105"
                />
                <img
                  src="/assets/logo/256pxFAVICON.png"
                  alt="KotCompass Favicon"
                  class="block sm:hidden h-10 w-auto"
                />
              </a>
            </div>

            <!-- Desktop Menu -->
            <div class="hidden md:flex items-center gap-6">
                <!-- Dashboard (Secondary Action) -->
                <a routerLink="/dashboard" 
                   class="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-100 hover:border-primary-200 transition-all duration-300 shadow-sm hover:shadow-md">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-primary-600 group-hover:text-primary-800 transition-colors">
                     <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                   </svg>
                   Dashboard
                </a>

                <!-- Zoek je kot (Primary CTA) -->
                <a routerLink="/kotcompass/rooms" 
                   class="px-6 py-2.5 rounded-full text-sm font-bold text-white bg-accent hover:bg-accent-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 shadow-md">
                   Zoek je kot
                </a>
            </div>

            <!-- Mobile Button -->
            <div class="md:hidden flex items-center">
                <button
                  class="flex flex-col justify-center items-center w-10 h-10 rounded-lg focus:outline-none hover:bg-gray-100 transition-colors"
                  (click)="menuOpen = !menuOpen"
                  aria-label="Toggle navigation menu"
                >
                  <span
                    class="block w-6 h-0.5 bg-primary-800 mb-1.5 rounded-full transition-all duration-300 transform origin-center"
                    [class.rotate-45]="menuOpen"
                    [class.translate-y-2]="menuOpen"
                  ></span>
                  <span
                    class="block w-6 h-0.5 bg-primary-800 mb-1.5 rounded-full transition-all duration-300"
                    [class.opacity-0]="menuOpen"
                    [class.translate-x-full]="menuOpen"
                  ></span>
                  <span
                    class="block w-6 h-0.5 bg-primary-800 rounded-full transition-all duration-300 transform origin-center"
                    [class.-rotate-45]="menuOpen"
                    [class.-translate-y-2]="menuOpen"
                  ></span>
                </button>
            </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div 
        class="md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 bg-white"
        [style.max-height.px]="menuOpen ? 200 : 0"
        [class.opacity-100]="menuOpen"
        [class.opacity-0]="!menuOpen"
      >
        <div class="px-4 py-4 space-y-3 shadow-inner bg-gray-50/50">
          <a
            routerLink="/kotcompass/rooms"
            class="block w-full py-3 px-4 rounded-full font-bold text-white bg-accent hover:bg-accent-600 text-center shadow-sm transition-transform active:scale-95"
            (click)="menuOpen = false"
            >Zoek je kot</a
          >
          <a 
            routerLink="/dashboard" 
            class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-full font-medium text-primary-700 bg-primary-50 border border-primary-100 hover:bg-primary-100 text-center transition-colors"
            (click)="menuOpen = false"
            >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
               <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Dashboard
          </a>
        </div>
      </div>
    </nav>
  `,
})
export class Navigation {
  menuOpen = false;
}
