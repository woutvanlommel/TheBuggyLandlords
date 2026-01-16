import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-adres-kotpage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-between items-start w-full">
      <!-- Linker Sectie (Info) -->
      <div class="flex flex-col">
        <!-- Titel (name) -->
        <h1 class="text-3xl font-bold text-primary-900 mb-1">
          {{ name }}
        </h1>

        <!-- Subtitel (postalCode + city) -->
        <div class="text-xl text-secondary mb-2">
          {{ postalCode }} {{ city }}
        </div>

        <!-- Meta-info regel -->
        <div class="flex items-center text-base-twee-700 text-sm gap-2">
          <span>{{ type }}</span>
          <span>/</span>
          <span>{{ surface }}m²</span>
          <span>/</span>
          <span>{{ bedrooms }} slp</span>
          <span>/</span>
          <span>{{ priceType }}</span>
        </div>
      </div>

      <!-- Rechter Sectie (Prijs) -->
      <div class="flex flex-col items-end">
        <!-- Prijs -->
        <div class="text-3xl font-bold text-base-twee-900">
          € {{ price }}
        </div>
        <!-- Link -->
        <a href="#" class="text-xs text-base-twee-600 underline mt-1">
          Opbouw huurprijs
        </a>
      </div>
    </div>
  `,
  styles: [''],
})
export class PriceAdresKotpage {
  @Input() name: string = '';
  @Input() postalCode: string = '';
  @Input() city: string = '';
  @Input() type: string = '';
  @Input() surface: number = 0;
  @Input() bedrooms: number = 0;
  @Input() priceType: string = '';
  @Input() price: number = 0;
}
