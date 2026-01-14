import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditPackagesComponent } from '../../../components/credit-packages/credit-packages.component';
import { LandlordSpotlightComponent } from '../../../components/landlord-spotlight/landlord-spotlight.component';
import { CreditService } from '../../../shared/credit.service';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule, CreditPackagesComponent, LandlordSpotlightComponent],
  template: `
    <div class="space-y-8">
        
        <!-- HEADER: BALANCE -->
        <div class="p-8 text-center bg-base-een-100/50 backdrop-blur-sm rounded-xl border border-primary-100/50 shadow-sm relative overflow-hidden group">
            <div class="absolute inset-0 bg-linear-to-r from-primary-100/20 to-secondary-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <h3 class="text-xl font-semibold text-base-twee-900 relative z-10">Mijn Credits</h3>
            
            <div class="mt-4 flex flex-col items-center justify-center relative z-10">
                  <span class="text-5xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-secondary-600">
                    {{ balance }}
                  </span>
                  <span class="mt-1 text-sm font-bold text-base-twee-500 uppercase tracking-widest">Beschikbaar</span>
            </div>
        </div>

        <!-- SECTION 1: BUY PACKAGES -->
        <section>
            <div class="flex items-center justify-between mb-4 px-2">
                <h2 class="text-lg font-bold text-base-twee-800">Buy Credits</h2>
                <span class="text-xs text-secondary-600 font-semibold cursor-pointer hover:underline">View History</span>
            </div>
            <app-credit-packages></app-credit-packages>
        </section>

        <!-- SECTION 2: LANDLORD TOOLS (SPOTLIGHT) -->
        <section *ngIf="userRole === 'Verhuurder'" class="bg-base-een-100/50 rounded-2xl border border-dashed border-base-twee-300 p-6">
            <div class="flex items-center gap-3 mb-6">
                <div class="bg-accent-100 p-2 rounded-lg text-accent-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <div>
                   <h2 class="text-lg font-bold text-base-twee-800">Spotlight Your Properties</h2>
                   <p class="text-xs text-base-twee-500">Boost visibility for 1 credit/day per property.</p>
                </div>
            </div>
            <app-landlord-spotlight></app-landlord-spotlight>
        </section>

        <section class="mt-8 text-center bg-primary-100 rounded-xl p-6">
           <h3 class="text-primary-800 font-bold mb-2">Need help with billing?</h3>
           <p class="text-primary-600 text-sm mb-4">Our support team is available 24/7 for payment issues.</p>
           <a href="mailto:KotCompass@outlook.com" class="inline-block bg-primary text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-primary-700 transition">Contact Support</a>
        </section>
    </div>
  `,
  styles: []
})
export class Credits implements OnInit {
  balance: number = 0;
  userRole: string | null = null;

  constructor(private creditService: CreditService, private authService: AuthService) {}

  ngOnInit() {
    this.creditService.balance$.subscribe(b => this.balance = b);
    this.userRole = sessionStorage.getItem('user_role');
  }
}
