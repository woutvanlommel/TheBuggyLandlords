import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditService, CreditPackage } from '../../shared/credit.service';

@Component({
  selector: 'app-credit-packages',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div *ngFor="let pack of packages" 
           class="relative bg-base-een-100 border border-base-twee-200 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center">
        
        <!-- Badge for best value if middle one -->
        <div *ngIf="pack.id === 2" class="absolute -top-3 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
          Most Popular
        </div>

        <h3 class="text-base-twee-700 font-semibold uppercase tracking-wide text-sm mb-2">{{ pack.name }}</h3>
        
        <div class="text-4xl font-extrabold text-base-twee-900 mb-1">
          {{ pack.credits }} <span class="text-base font-medium text-base-twee-600">credits</span>
        </div>
        
        <div class="text-2xl font-bold text-primary-600 mb-6">€{{ pack.price }}</div>

        <ul class="w-full space-y-3 mb-8">
            <li class="flex items-center text-sm text-base-twee-700">
                <svg class="w-4 h-4 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Valid forever
            </li>
            <li class="flex items-center text-sm text-base-twee-700">
                <svg class="w-4 h-4 mr-2 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                Instant activation
            </li>
        </ul>

        <button (click)="buy(pack)" 
                [disabled]="loadingId === pack.id"
                class="w-full mt-auto py-3 rounded-xl font-bold transition-all flex items-center justify-center"
                [ngClass]="pack.id === 2 ? 'bg-primary text-white hover:bg-primary-600 shadow-md' : 'bg-base-een-200 text-base-twee-900 hover:bg-base-een-300 border border-base-twee-300'">
            <span *ngIf="loadingId !== pack.id">Buy Now</span>
            <span *ngIf="loadingId === pack.id">Processing...</span>
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class CreditPackagesComponent implements OnInit {
  packages: CreditPackage[] = [];
  loadingId: number | null = null;

  constructor(private creditService: CreditService) {}

  ngOnInit() {
    this.creditService.getPackages().subscribe(res => {
      this.packages = res;
    });
  }

  buy(pack: CreditPackage) {
    this.loadingId = pack.id;
    this.creditService.buyPackage(pack.id).subscribe(success => {
      this.loadingId = null;
      if (success) {
        alert('Package purchased successfully!'); // Replace with toast later
      }
    });
  }
}
