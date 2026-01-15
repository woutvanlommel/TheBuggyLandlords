import { Component, Input, inject } from '@angular/core';
import { NgClass, NgIf } from "@angular/common";
import { User } from '../../models/user';
import { CreditService } from '../../shared/credit.service';

@Component({
  selector: 'app-contact-card',
  imports: [NgClass, NgIf],
  template: `
  <div class="rounded-xl shadow-md max-w-md bg-white w-full border border-gray-200 overflow-hidden" [ngClass]="{'ring-2 ring-accent ring-offset-2': isSpotlighted}">
    
    <!-- Profile Header / Image -->
    <div class="flex flex-col items-center justify-center p-6 bg-base-een-100/50 border-b border-gray-100">
      <div class="relative mb-4">
        <img 
          [src]="user?.profile_image_url || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=0D9488&color=fff&size=128'" 
          alt="Verhuurder profielfoto"
          class="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
        >

      </div>
      
      <h3 class="text-xl font-bold text-base-twee-900">{{ user?.fname }} {{ user?.name }}</h3>
      <p class="text-sm text-primary-600 font-medium">Verhuurder</p>
    </div>

    <!-- Contact Details -->
    <div class="p-6 text-center space-y-4">
      
      <!-- Unlocked State -->
      <div *ngIf="isUnlocked || isSpotlighted" class="space-y-3 animate-fade-in">
        <div class="flex items-center justify-center gap-3 text-base-twee-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          <a [href]="'mailto:' + user?.email" class="hover:text-primary transition-colors font-medium">{{ user?.email }}</a>
        </div>
        
        <div *ngIf="user?.phone" class="flex items-center justify-center gap-3 text-base-twee-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            <a [href]="'tel:' + user?.phone" class="hover:text-primary transition-colors font-medium">{{ user?.phone }}</a>
        </div>
      </div>

      <!-- Locked State -->
      <div *ngIf="!isUnlocked && !isSpotlighted" class="space-y-4">
        <p class="text-sm text-base-twee-600">
            De contactgegevens van deze verhuurder zijn afgeschermd. Gebruik 1 credit om ze te ontgrendelen.
        </p>
        
        <button 
          (click)="unlockContact()" 
          [disabled]="isLoading" 
          class="w-full py-2.5 px-4 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <svg *ngIf="!isLoading" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
          </svg>
          <span *ngIf="isLoading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isLoading ? 'Even geduld...' : 'Ontgrendel met 1 Credit' }}
        </button>
      </div>

      <!-- Error Message -->
      <div *ngIf="errorMessage" class="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-start gap-2 text-left">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
         <span>{{ errorMessage }}</span>
      </div>

    </div>
  </div>`,
  styles: ``,
})
export class ContactCard {
  @Input() user?: any;
  @Input() roomId?: number;
  @Input() isSpotlighted: boolean = false;

  isUnlocked: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  private creditService = inject(CreditService);

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
        } else {
          this.errorMessage = 'Could not unlock contact details.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'An error occurred. Do you have enough credits?';
      }
    });
  }



}