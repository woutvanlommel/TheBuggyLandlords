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
        <div class="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center gap-6 text-center">
            <h1 class="text-3xl md:text-5xl font-light text-white tracking-wide">
              Vind jouw ideale kot met <span class="font-bold text-accent">KotCompass</span>
            </h1>
            <h2 class="text-xl md:text-2xl font-medium text-gray-200 mb-8">
              Ontdek duizenden studentenkamers in heel België
            </h2>
            
            <div class="w-full max-w-2xl transform transition-all hover:scale-[1.01]">
              <app-app-home-search></app-app-home-search>
            </div>

            <div class="w-full mt-6">
              <app-app-city-tiles></app-app-city-tiles>
            </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroZoekplatform {}
