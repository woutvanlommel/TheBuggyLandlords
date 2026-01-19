import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-price-adres-kotpage',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Breadcrumbs -->
    <div class="text-sm text-base-twee-600 mb-2">
      <a routerLink="/kotcompass/zoekplatform">Home</a> /
      <a routerLink="/kotcompass/rooms">Zoekplatform</a> /
      <span class="text-accent">{{ street }} {{ houseNumber }}, {{ postalCode }} {{ city }}</span>
    </div>
    <div class="flex justify-between items-start w-full">
      <!-- Left (info) -->
      <div class="flex flex-col">
        <!-- Title (name) -->
        <h1 class="text-3xl font-bold text-primary-900 mb-1">
          {{ name }}
        </h1>

        <!-- Subtitle (postalCode + city) -->
        <div class="text-xl text-secondary mb-2">
          {{ street }} {{ houseNumber }}, {{ postalCode }} {{ city }}
        </div>

        <!-- Meta-info line -->
        <div class="flex items-center text-base-twee-700 text-sm gap-2">
          <span>{{ type }}</span>
          <span>/</span>
          <span>{{ surface }}m²</span>
          <span>/</span>
          <span>{{ priceType }}</span>
        </div>
      </div>

      <!-- Right (price) -->
      <div class="flex flex-col items-end">
        <!-- price -->
        <div class="text-3xl font-bold text-base-twee-900">€ {{ price }}</div>
        <!-- Link -->
        <a href="#" class="text-xs text-base-twee-600 underline mt-1"> Opbouw huurprijs </a>
      </div>
    </div>
  `,
  styles: [''],
})
export class PriceAdresKotpage {
  @Input() name: string = '';
  @Input() street: string = '';
  @Input() houseNumber: string = '';
  @Input() postalCode: string = '';
  @Input() city: string = '';
  @Input() type: string = '';
  @Input() surface: number = 0;
  @Input() priceType: string = '';
  @Input() price: number = 0;
}
