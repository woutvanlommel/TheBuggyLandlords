import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-price-calculation-kotpage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-primary/5 rounded-3xl p-8 border border-primary/10">
      <div class="flex items-center gap-3 mb-8">
        <div
          class="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-6 h-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75m0 1.5v.75m0 1.5v.75m0 1.5V15m11.456-1.5H12m1.456 0a1.5 1.5 0 1 0-2.912 0 1.5 1.5 0 0 0 2.912 0ZM12 11.25a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H12.75a.75.75 0 0 1-.75-.75v-.008ZM12 7.5a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H12.75a.75.75 0 0 1-.75-.75V7.5Z"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-black text-primary-900 tracking-tight">Kostenoverzicht</h3>
      </div>

      <div class="space-y-4">
        <!-- Basis huurprijs -->
        <div class="flex justify-between items-center py-2">
          <span class="text-gray-600 font-medium">Basis huurprijs</span>
          <span class="text-lg font-bold text-gray-900"
            >€{{ pricePerMonth | number: '1.2-2' }}</span
          >
        </div>

        <!-- Terugkerende extra kosten -->
        @if (recurringCosts.length > 0) {
          <div class="pt-4 border-t border-primary/10 space-y-3">
            <p class="text-[10px] font-black uppercase tracking-widest text-primary-400 mb-2">
              Maandelijkse extra's
            </p>
            @for (cost of recurringCosts; track cost.id) {
              <div class="flex justify-between items-center text-gray-600">
                <span class="text-sm font-medium">{{ cost.name }}</span>
                <span class="text-base font-bold text-gray-800"
                  >€{{ cost.pivot?.price || 0 | number: '1.2-2' }}</span
                >
              </div>
            }
          </div>
        }

        <!-- Totaal per maand -->
        <div class="mt-8 pt-6 border-t-2 border-primary-200 flex flex-col gap-1">
          <div class="flex justify-between items-end">
            <span class="text-gray-500 font-bold uppercase text-[11px] tracking-wider"
              >Totaal per maand</span
            >
            <span class="text-3xl font-black text-primary-600"
              >€{{ totalMonthlyCost | number: '1.2-2' }}</span
            >
          </div>
          <p class="text-[10px] text-gray-400 font-medium italic">* Exclusief eenmalige kosten</p>
        </div>

        <!-- Eenmalige kosten (bv. Waarborg) -->
        @if (oneTimeCosts.length > 0) {
          <div class="mt-8 pt-8 border-t border-dashed border-gray-300">
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[10px] font-black uppercase tracking-widest text-orange-500"
                >Eenmalige kosten</span
              >
            </div>
            <div class="space-y-3">
              @for (cost of oneTimeCosts; track cost.id) {
                <div
                  class="flex justify-between items-center bg-orange-50/50 p-4 rounded-2xl border border-orange-100"
                >
                  <div class="flex flex-col">
                    <span class="text-sm font-bold text-gray-900">{{ cost.name }}</span>
                    <span class="text-[10px] text-orange-600 font-medium italic"
                      >Bij aanvang te betalen</span
                    >
                  </div>
                  <span class="text-xl font-black text-gray-900"
                    >€{{ cost.pivot?.price || 0 | number: '1.2-2' }}</span
                  >
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class PriceCalculationKotpage {
  @Input() pricePerMonth: number = 0;
  @Input() extraCostsList: any[] = [];

  get recurringCosts(): any[] {
    if (!this.extraCostsList) return [];
    return this.extraCostsList.filter((cost) => cost.is_recurring);
  }

  get oneTimeCosts(): any[] {
    if (!this.extraCostsList) return [];
    return this.extraCostsList.filter((cost) => !cost.is_recurring);
  }

  get totalMonthlyCost(): number {
    const base = Number(this.pricePerMonth) || 0;
    const recurringExtras = this.recurringCosts.reduce(
      (acc, cost) => acc + (Number(cost.pivot?.price) || 0),
      0,
    );
    return base + recurringExtras;
  }
}
