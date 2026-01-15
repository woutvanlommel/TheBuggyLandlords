import { Component, Input, inject } from '@angular/core';
import { NgClass, NgIf } from "@angular/common";
import { User } from '../../models/user';
import { CreditService } from '../../shared/credit.service';

@Component({
  selector: 'app-contact-card',
  imports: [NgClass, NgIf],
  template: `
  <div class="card contactDetails" [ngClass]="{'spotlight-active': isSpotlighted}">
    <img [src]="user?.profile_image_url || 'https://ui-avatars.com/api/?name=' + (user?.name || 'User') + '&background=0D9488&color=fff&size=128'" alt="profilePicture">
    <h3>{{ user?.fname }} {{ user?.name }}</h3>
    <div *ngIf="isUnlocked || isSpotlighted">
      <p>{{ user?.email }}</p>
      <p>{{ user?.phone }}</p>
    </div>

    <div *ngIf="!isUnlocked && !isSpotlighted" class="locked-info">
      <p>Use credits to see contact details</p>
      <button (click)="unlockContact()" [disabled]="isLoading" class="unlock-btn">
        {{ isLoading ? 'Unlocking...' : 'Unlock Contact' }}
      </button>
    </div>
    <div *ngIf="errorMessage" class="error-message" style="color: red;">
      {{ errorMessage }}
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