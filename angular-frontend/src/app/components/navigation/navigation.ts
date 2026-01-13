import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  standalone: true,
  template: `
    <nav class="bg-white w-full shadow-lg py-4 px-4">
      <div class="flex flex-row justify-between items-center w-full max-w-300 mx-auto">
        <div>
          <a routerLink="/kotcompass/zoekplatform" class="flex items-center">
            <img
              src="/assets/logo/1.400pxX100pxLogoLiggendOranje.png"
              alt="KotCompass Logo"
              class="hidden sm:block h-16"
            />
            <img
              src="/assets/logo/256pxFAVICON.png"
              alt="KotCompass Favicon"
              class="block sm:hidden h-12"
            />
          </a>
        </div>
        <!-- Hamburger button for mobile -->
        <button
          class="md:hidden flex flex-col justify-center items-center w-fit focus:outline-none"
          (click)="menuOpen = !menuOpen"
          aria-label="Toggle navigation menu"
        >
          <span
            class="block w-7 h-1 bg-primary mb-1 rounded transition-all duration-200"
            [class.rotate-45]="menuOpen"
            [class.translate-y-2]="menuOpen"
          ></span>
          <span
            class="block w-7 h-1 bg-primary mb-1 rounded transition-all duration-200"
            [class.opacity-0]="menuOpen"
          ></span>
          <span
            class="block w-7 h-1 bg-primary rounded transition-all duration-200"
            [class.-rotate-45]="menuOpen"
            [class.-translate-y-2]="menuOpen"
          ></span>
        </button>
        <!-- Desktop menu -->
        <div class="hidden md:flex justify-end items-center gap-4">
          <div class="flex items-center justify-center py-2 px-6 bg-accent rounded-md">
            <a routerLink="/kotcompass/rooms" class="text-base md:text-lg text-white"
              >Zoek je kot</a
            >
          </div>
          <div class="flex items-center justify-center py-2 px-6 bg-primary rounded-md">
            <a routerLink="/dashboard" class="text-base md:text-lg text-white">Dashboard</a>
          </div>
        </div>
      </div>
      <!-- Mobile menu -->
      @if (menuOpen) {
      <div class="md:hidden w-full mt-4 flex flex-col gap-2 transition-all duration-300">
        <div class="flex flex-col gap-2 items-stretch">
          <a
            routerLink="/kotcompass/zoekplatform"
            class="py-3 px-4 bg-accent rounded-md text-white text-center"
            >Zoek je kot</a
          >
          <a routerLink="/dashboard" class="py-3 px-4 bg-primary rounded-md text-white text-center"
            >Dashboard</a
          >
        </div>
      </div>
      }
    </nav>
  `,
})
export class Navigation {
  menuOpen = false;
}
