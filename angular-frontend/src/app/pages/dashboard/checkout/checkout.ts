import { Component, OnInit, ViewChild, signal, ChangeDetectorRef, NgZone, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, timeout, Observable } from 'rxjs';
import { StripeService, StripePaymentElementComponent, NgxStripeModule } from 'ngx-stripe';
import { StripeElementsOptions, StripePaymentElementOptions, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { CreditService, CreditPackage } from '../../../shared/credit.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, NgxStripeModule],
  template: `
    <div class="max-w-2xl mx-auto p-6 md:p-8">
      
      <!-- Back Button -->
      <button (click)="goBack()" class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-800 mb-6 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Credits
      </button>

      <!-- Header -->
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
      <p class="text-gray-600 mb-8" *ngIf="selectedPackage">
        You are purchasing <span class="font-semibold text-primary-600">{{ selectedPackage.name }}</span> package for 
        <span class="font-bold text-gray-900">€{{ selectedPackage.price }}</span>.
      </p>

      <!-- Error State -->
      <div *ngIf="errorMessage" class="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start">
         <svg class="w-5 h-5 mr-3 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
         <div>
           <p class="font-medium">Something went wrong</p>
           <p class="text-sm mt-1">{{ errorMessage }}</p>
           <button (click)="retry()" class="mt-2 text-sm font-bold underline hover:text-red-800">Try Again</button>
         </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading" class="flex flex-col items-center justify-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <svg class="animate-spin h-10 w-10 text-primary-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-500 font-medium">Preparing secure checkout...</p>
      </div>

      <!-- Payment Form -->
      <div *ngIf="clientSecret && !loading" class="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 animate-fade-in">
          
          <div class="mb-6">
             <!-- Manual Mount Point -->
             <div #paymentElementRef class="min-h-250px w-full bg-gray-50 rounded"></div> 
          </div>
          
          <div *ngIf="!elementsInstance" class="text-center p-4">Initializing Stripe...</div>

          <button (click)="pay()" 
                  [disabled]="paying"
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed">
              <span *ngIf="!paying">Confirm Payment €{{ selectedPackage?.price }}</span>
              <span *ngIf="paying" class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
              </span>
          </button>
          
          <p class="mt-4 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
             <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             Payments are secure and encrypted.
          </p>
      </div>

    <!-- Persistent Debug Log (Always Visible) -->
    <!--  
    <div class="fixed bottom-0 left-0 right-0 bg-gray-900/90 text-green-400 p-2 text-xs font-mono max-h-32 overflow-auto z-50">
        <div class="font-bold border-b border-gray-700 mb-1">Debug Output:</div>
        <div>Loading: {{ loading }}</div>
        <div>Stripe Loaded: {{ !!stripe }}</div>
        <div>Client Secret: {{ !!clientSecret }}</div>
        <div>Elements Inst: {{ !!elementsInstance }}</div>
        <div *ngIf="clientSecret">Secret Start: {{ clientSecret?.substring(0, 5) }}...</div>
    </div>
    -->
  `,
  styles: [`
    .animate-fade-in {
        animation: fadeIn 0.5s ease-out;
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  // Use ViewChild to get reference to the mounting div
  @ViewChild('paymentElementRef') paymentElementRef!: ElementRef;

  elementsInstance: StripeElements | undefined;
  paymentElementInstance: StripePaymentElement | undefined;
  
  stripe: any = null;
  clientSecret: string | undefined;
  
  selectedPackage: CreditPackage | undefined;
  packageId: number = 0;
  
  loading = true;
  paying = false;
  errorMessage = '';
  debugLogs: string[] = [];

  // Removed unused options
  // elementsOptions: StripeElementsOptions = ...

  paymentElementOptions: StripePaymentElementOptions = {
    layout: {
      type: 'tabs',
      defaultCollapsed: false,
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private creditService: CreditService,
    private stripeService: StripeService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.packageId = +params['packageId'];
      this.loadPackageAndIntent();
    });
  }

  loadPackageAndIntent() {
    this.loading = true;
    this.errorMessage = '';
    this.debugLogs = ['Init loadPackageAndIntent'];

    // 1. Get Package Details (so we can show price)
    this.debugLogs.push('Loading packages...');
    console.log('Loading packages...');
    this.creditService.getPackages().subscribe(packages => {
      this.debugLogs.push('Packages loaded: ' + packages.length);
      console.log('Packages loaded:', packages);
      this.selectedPackage = packages.find(p => p.id === this.packageId);
      
      if (!this.selectedPackage) {
        console.error('Package not found:', this.packageId);
        this.debugLogs.push('ERROR: Package not found ' + this.packageId);
        this.errorMessage = 'Invalid Package Selected';
        this.loading = false;
        return;
      }

      // 2. Create Intent
      this.debugLogs.push('Creating intent for package ' + this.packageId);
      console.log('Creating payment intent for package:', this.packageId);
      this.creditService.createPaymentIntent(this.packageId)
      .pipe(
        timeout(10000)
      )
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            this.debugLogs.push('Intent created. Secret length: ' + (res?.clientSecret?.length || 0));
            console.log('Payment intent created:', res);
            
            if (!res || !res.clientSecret) {
               console.error('No clientSecret returned from backend!', res);
               this.debugLogs.push('ERROR: No clientSecret');
               this.errorMessage = 'Invalid server response';
               this.loading = false;
               return;
            }

            this.clientSecret = res.clientSecret;
            this.loading = false;
            this.debugLogs.push('Client Secret Received');
            
            this.cdr.detectChanges(); // Update view to show div
            
            // Wait for view check then mount
            setTimeout(() => this.mountPaymentElement(), 100); 
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.debugLogs.push('ERROR: Intent failed: ' + (err.message || 'Unknown'));
            console.error('Payment Intent Validation Error:', err);
            this.errorMessage = 'Could not initialize payment. Please check your connection.';
            this.loading = false;
            this.cdr.detectChanges();
          });
        }
      });
    });
  }

  retry() {
      this.loadPackageAndIntent();
  }

  mountPaymentElement() {
      if (!this.clientSecret || !this.paymentElementRef) {
          this.debugLogs.push(`Mount skipped: CS=${!!this.clientSecret} Ref=${!!this.paymentElementRef}`);
          return;
      }
      
      if (this.elementsInstance) {
          this.debugLogs.push('Already mounted');
          return;
      }
      
      this.debugLogs.push('Mounting Payment Element (via Service)...');
      
      this.stripeService.elements({
          clientSecret: this.clientSecret,
          appearance: {
              theme: 'stripe',
              variables: { colorPrimary: '#4f46e5' }
          }
      }).subscribe({
          next: (elements) => {
              this.elementsInstance = elements;
              try {
                  this.paymentElementInstance = this.elementsInstance.create('payment');
                  this.paymentElementInstance.mount(this.paymentElementRef.nativeElement);
                  this.debugLogs.push('Payment Element Mounted Successfully');
                  this.cdr.detectChanges(); // Update view/button state
              } catch (e: any) {
                  this.debugLogs.push('Mount Error: ' + e.message);
              }
          },
          error: (err) => {
              this.debugLogs.push('Stripe Service Error: ' + err.message);
          }
      });
  }

  onElementsLoad(elements: StripeElements) {
    console.log('Stripe Elements Loaded:', elements);
    this.elementsInstance = elements;
  }

  pay() {
    if (this.paying) return;
    if (!this.elementsInstance) {
        console.error('Stripe Elements instance not loaded');
        this.errorMessage = 'Payment form not ready';
        return;
    }

    this.paying = true;
    this.errorMessage = '';

    this.stripeService.confirmPayment({
      elements: this.elementsInstance,
      confirmParams: {
        return_url: window.location.origin + '/dashboard/credits',
      },
      redirect: 'if_required' 
    }).subscribe({
      next: (result) => {
        if (result.error) {
          this.paying = false;
          this.errorMessage = result.error.message || 'Payment failed';
        } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
           this.verifyAndComplete(result.paymentIntent.id);
        }
      },
      error: (err) => {
        this.paying = false;
        console.error('Stripe Confirm Error:', err);
        this.errorMessage = err.message || 'An unexpected error occurred during payment processing.';
      }
    });
  }

  verifyAndComplete(paymentIntentId: string) {
      this.creditService.verifyPayment(paymentIntentId).subscribe({
          next: (res) => {
              this.paying = false;
              if (res.success) {
                  // Success Message and Redirect
                  alert(`Success! Payment verified.\nAdded: ${res.credits_added} credits.\nNew Balance: ${res.new_balance}`);
                  this.router.navigate(['/dashboard/credits']);
              } else {
                  this.errorMessage = 'Payment verified but failed to add credits. Please contact support.';
              }
          },
          error: (err) => {
              this.paying = false;
              this.errorMessage = 'Could not verify payment. Please contact support.';
          }
      });
  }

  goBack() {
    this.router.navigate(['/dashboard/credits']);
  }
}
