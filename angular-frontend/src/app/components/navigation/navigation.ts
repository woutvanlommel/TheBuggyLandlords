import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  standalone: true,
  template: `
    <nav class="flex justify-center items-center bg-white w-full shadow-lg pt-8 pb-16">
      <div class="flex flex-row justify-between items-center gap-6 w-full max-w-300 mx-auto">
        <div>
          <a routerLink="/kotcompass/zoekplatform" class="text-5xl text-primary">KotCompass</a>
        </div>
        <div routerLink="/kotcompass/zoekplatform" class="w-52 aspect-3/1 bg-base-een-700"></div>
        <div class="flex justify-end items-center gap-4">
          <div class="flex items-center justify-center py-2 px-8 bg-accent rounded-md">
            <a routerLink="/kotcompass/zoekplatform" class="text-lg text-white">Zoek je kot</a>
          </div>
          <div class="flex items-center justify-center py-2 px-8 bg-primary rounded-md">
            <a routerLink="/dashboard" class="text-lg text-white">Dashboard</a>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class Navigation {}
