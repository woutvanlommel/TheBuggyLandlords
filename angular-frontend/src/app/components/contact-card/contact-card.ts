import { Component, Input, Output, EventEmitter, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgIf } from "@angular/common";
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { CreditService } from '../../shared/credit.service';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-contact-card',
  imports: [NgClass, NgIf],
  template: `
  <div class="rounded-xl shadow-md max-w-md bg-white w-full border border-gray-200 overflow-hidden p-6 flex flex-row gap-6 items-start" [ngClass]="{'ring-2 ring-accent ring-offset-2': isSpotlighted}">

    <!-- Left Column: Profile Image -->
    <div class="shrink-0">
    <img
    [attr.src]="user?.profile_picture?.file_path || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=0D9488&color=fff&size=128'"
      alt="{{ user?.fname }} profielfoto"
      class="w-20 h-20 rounded-full border-4 border-base-een-100 shadow-sm object-cover transition-all duration-300"
      [ngClass]="{'filter blur-md select-none opacity-80': !canViewContact}">
    </div>

    <!-- Right Column: All Text & Actions -->
    <div class="flex flex-col w-full space-y-3">

      <!-- Header Info -->
      <div class="text-left relative">
          <h3 class="text-xl font-bold text-base-twee-900 leading-tight transition-all duration-300"
              [ngClass]="{'filter blur-sm select-none opacity-70': !canViewContact}">
              {{ user?.fname }} {{ user?.name }}
          </h3>
          <p class="text-sm text-primary-600 font-medium transition-all duration-300" [ngClass]="{'filter blur-sm select-none opacity-70': !canViewContact}">Verhuurder</p>
      </div>

      <!-- Contact Details Section -->
      <div class="relative text-left w-full">

        <!-- Unlocked State (Real Data) -->
        <div *ngIf="canViewContact" class="space-y-2 animate-fade-in block">
          <div class="flex items-center justify-start gap-3 text-base-twee-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            <a [href]="'mailto:' + user?.email" class="hover:text-primary transition-colors font-medium break-all text-sm">{{ user?.email }}</a>
          </div>

          <div *ngIf="user?.phone" class="flex items-center justify-start gap-3 text-base-twee-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <a [href]="'tel:' + user?.phone" class="hover:text-primary transition-colors font-medium text-sm">{{ user?.phone }}</a>
          </div>
        </div>

        <!-- Locked State (Blurred + Overlay) -->
        <div *ngIf="!canViewContact" class="relative w-full">

            <!-- Fake Blurred Content -->
            <div class="space-y-2 select-none filter blur-sm opacity-60 pointer-events-none" aria-hidden="true">
              <div class="flex items-center justify-start gap-3 text-base-twee-700">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span class="font-medium text-sm">contact@housing.be</span>
              </div>

              <div class="flex items-center justify-start gap-3 text-base-twee-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <span class="font-medium text-sm">+32 4XX XX XX XX</span>
              </div>
            </div>

            <!-- Overlay Button -->
            <div class="absolute inset-0 z-10 flex flex-col items-center justify-center -ml-4">
               <button
                (click)="handleAction()"
                [disabled]="isLoading"
                class="py-1.5 px-3 bg-primary text-white text-xs font-semibold rounded-lg shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <svg *ngIf="!isLoading && isLoggedIn" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                </svg>
                <span *ngIf="isLoading" class="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>

                <span *ngIf="!isLoading">
                    {{ isLoggedIn ? 'Toon (1 Credit)' : 'Log in' }}
                </span>
              </button>
            </div>

        </div>

        <!-- Error Message -->

        <div *ngIf="errorMessage" class="p-2 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 flex items-center gap-2 text-left mt-2">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
           <span>{{ errorMessage }}</span>
        </div>

      </div>
    </div>
  </div>`,
  styles: ``,
})
export class ContactCard implements OnInit {
  @Input() user?: any;
  @Input() roomId?: number;
  @Input() isSpotlighted: boolean = false;
  @Input() isUnlocked: boolean = false; // Now an Input from parent
  @Output() unlocked = new EventEmitter<void>();

  isLoading: boolean = false;
  errorMessage: string = '';
  isLoggedIn: boolean = false;
  currentUserId: number | null = null;

  private cdr = inject(ChangeDetectorRef);
  private creditService = inject(CreditService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
      // Simple check for token presence
      this.isLoggedIn = !!this.authService.getToken();
      const storedId = sessionStorage.getItem('user_id');
      if (storedId) {
        this.currentUserId = Number(storedId);
      }
  }

  get canViewContact(): boolean {
    // Must be logged in AND (unlocked OR spotlighted OR owner)
    return this.isLoggedIn && (this.isUnlocked || this.isSpotlighted || (!!this.user && this.currentUserId === this.user.id));
  }

  handleAction() {
    if (!this.isLoggedIn) {
      // Redirect to login if not logged in
      this.router.navigate(['/login']);
      return;
    }
    this.unlockContact();
  }

  unlockContact() {
    if (!this.roomId) {
      this.errorMessage = 'No room ID provided.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.creditService.unlockChat(this.roomId).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.isUnlocked = true;
          this.unlocked.emit(); // Notify parent to refresh data
          this.cdr.detectChanges(); // Force UI update
        } else {
          this.errorMessage = 'Could not unlock contact details.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'An error occurred. Do you have enough credits?';
        this.cdr.detectChanges();
      }
    });
  }



}
