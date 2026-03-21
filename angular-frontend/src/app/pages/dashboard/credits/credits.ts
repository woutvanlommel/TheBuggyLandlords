import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; // Added Router
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
        <div
          *ngIf="toastVisible"
          class="credit-toast fixed top-6 right-6 z-50 w-[min(92vw,24rem)] rounded-xl border shadow-xl backdrop-blur-sm"
          [ngClass]="toastClassList"
        >
            <div class="p-4 pr-11 relative">
                <div class="flex items-start gap-3">
                    <div class="mt-0.5 h-2.5 w-2.5 rounded-full" [class]="toastVariant === 'success' ? 'bg-secondary-500' : 'bg-primary-500'"></div>
                    <div class="min-w-0">
                        <p class="font-bold text-sm">{{ toastTitle }}</p>
                        <p class="text-sm text-base-twee-700 mt-1">{{ toastMessage }}</p>
                    </div>
                </div>
                <button
                  type="button"
                  class="absolute top-2 right-2 rounded-md p-1 text-base-twee-500 hover:bg-base-een-100/70 hover:text-base-twee-700 transition-colors"
                  aria-label="Sluit melding"
                  (click)="dismissToast()"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        
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
            
            <!-- Pending Verification Spinner -->
            <div *ngIf="verifying" class="mt-2 text-primary-600 text-sm font-semibold animate-pulse">
                Verifying payment...
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
        <section *ngIf="isLandlord" class="bg-base-een-100/50 rounded-2xl border border-dashed border-base-twee-300 p-6">
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
    styles: [
        `
            .credit-toast {
                animation: credit-toast-enter 220ms ease-out;
            }

            @keyframes credit-toast-enter {
                from {
                    opacity: 0;
                    transform: translate3d(18px, -8px, 0);
                }
                to {
                    opacity: 1;
                    transform: translate3d(0, 0, 0);
                }
            }
        `
    ]
})
export class Credits implements OnInit, OnDestroy {
  balance: number = 0;
  isLandlord: boolean = false;
  verifying: boolean = false;
    toastVisible: boolean = false;
    toastTitle: string = '';
    toastMessage: string = '';
    toastVariant: 'success' | 'info' = 'success';
    private toastTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private creditService: CreditService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.creditService.refreshBalance();
    this.creditService.balance$.subscribe(b => this.balance = b);
    
    // Normalize role check (handle case-insensitive)
    const role = sessionStorage.getItem('user_role');
    this.isLandlord = !!role && role.toLowerCase() === 'verhuurder';

    // Check for Payment Return
    this.route.queryParams.subscribe(params => {
      const paymentIntentId = params['payment_intent'];
      const redirectStatus = params['redirect_status'];

      if (paymentIntentId && redirectStatus === 'succeeded') {
         this.handlePaymentReturn(paymentIntentId);
      }
    });
  }

    ngOnDestroy() {
        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
        }
    }

    get toastClassList(): string {
        if (this.toastVariant === 'success') {
            return 'border-secondary-200 bg-linear-to-r from-secondary-100 to-base-een-100 text-base-twee-900';
        }

        return 'border-primary-200 bg-linear-to-r from-primary-100 to-base-een-100 text-base-twee-900';
    }

    private showToast(title: string, message: string, variant: 'success' | 'info' = 'success', durationMs: number = 4500) {
        this.toastTitle = title;
        this.toastMessage = message;
        this.toastVariant = variant;
        this.toastVisible = true;

        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
        }

        this.toastTimer = setTimeout(() => {
            this.dismissToast();
        }, durationMs);
    }

    dismissToast() {
        this.toastVisible = false;

        if (this.toastTimer) {
            clearTimeout(this.toastTimer);
            this.toastTimer = null;
        }
    }

  handlePaymentReturn(paymentIntentId: string) {
      if (this.verifying) return;
      this.verifying = true;

      // Clear params from URL so we don't re-verify on refresh
      this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { payment_intent: null, payment_intent_client_secret: null, redirect_status: null },
          queryParamsHandling: 'merge',
          replaceUrl: true
      });

      this.creditService.verifyPayment(paymentIntentId).subscribe({
          next: (res) => {
              this.verifying = false;
              if (res.success) {
                                    this.showToast(
                                        'Betaling gelukt',
                                        `+${res.credits_added} credits toegevoegd. Nieuw saldo: ${res.new_balance}.`,
                                        'success'
                                    );
                  this.creditService.refreshBalance(); // Force refresh
              } else {
                  console.error('Payment verified but logic failed', res);
                                    this.showToast(
                                        'Betaling verwerkt',
                                        'Je credits worden zo meteen bijgewerkt.',
                                        'info'
                                    );
              }
          },
          error: (err) => {
              this.verifying = false;
              console.error('Verification Error', err);
              // It's possible the webhook handled it already, or a transient error.
              // Just refresh balance to be sure.
              this.creditService.refreshBalance();
          }
      });
  }
}
