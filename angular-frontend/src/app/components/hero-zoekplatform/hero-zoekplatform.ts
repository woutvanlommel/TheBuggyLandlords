import { Component } from '@angular/core';
import { AppHomeSearch } from '../app-home-search/app-home-search';
import { AppCityTiles } from '../app-city-tiles/app-city-tiles';

@Component({
  selector: 'app-hero-zoekplatform',
  imports: [AppHomeSearch, AppCityTiles],
  standalone: true,
  styles: [
    `
      .bg-hero {
        background-image: url('/assets/img/hero-bg.jpg');
        background-size: cover;
        background-position: center;
        width: 100%;
      }
    `,
  ],
  template: `
    <section class="relative w-full">
      <div class="w-full bg-hero min-h-[85vh] relative flex flex-col items-center justify-center">
        <!-- Dark Overlay -->
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-[2px]"></div>

        <!-- Content -->
        <div class="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-8 text-center pt-20">
            <!-- Typographic Header -->
            <div class="flex flex-col items-center gap-4">
              <h1 class="text-4xl md:text-6xl lg:text-7xl font-sans font-light text-white tracking-tight leading-tight">
                De slimste weg naar <br class="hidden sm:block">
                jouw <span class="font-bold text-accent">perfecte studentenkot</span>
              </h1>
              <p class="text-lg md:text-2xl font-light text-gray-200 max-w-3xl leading-relaxed mt-4">
                Met KotCompass vind je eenvoudig en direct de ideale studentenkamer die bij jou past.
              </p>
            </div>
            
            <div class="w-full max-w-3xl transform transition-all hover:scale-[1.01] relative z-50 mt-8">
              <app-app-home-search></app-app-home-search>
            </div>

            <div class="w-full">
              <app-app-city-tiles></app-app-city-tiles>
            </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroZoekplatform {}
