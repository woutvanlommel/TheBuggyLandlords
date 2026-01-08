import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  standalone: true,
  template: `
    <nav class="flex justify-center items-center bg-white w-full shadow-lg">
      <div class="flex flex-row justify-between items-center gap-6 w-full max-w-300 mx-auto">
        <div>
          <a routerLink="/kotcompass" class="text-5xl text-primary">KotCompass</a>
        </div>
        <div routerLink="/kotcompass" class="w-52 aspect-3/2 bg-base-een-700"></div>
        <div>
          <div class="flex items-center justify-center py-4 px-8 bg-accent">
            <a routerLink="/kotcompass" class="text-lg text-white">Zoek je kot</a>
          </div>
          <div class="flex items-center justify-center py-4 px-8 bg-primary">
            <a routerLink="/dashboard" class="text-lg text-white">Dashboard</a>
          </div>
        </div>
      </div>
    </nav>
  `,
})
export class Navigation {}
