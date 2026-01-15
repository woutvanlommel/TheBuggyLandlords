import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditService } from '../../shared/credit.service';

@Component({
  selector: 'app-tenant-chat-unlock',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-base-een-100 border p-6 rounded-2xl shadow-sm text-center">
      <div *ngIf="!isUnlocked">
        <h3 class="font-bold text-base-twee-900 text-lg mb-2">Interested in this propery?</h3>
        <p class="text-base-twee-600 text-sm mb-6">Start a conversation with the landlord directly.</p>
        
        <button (click)="unlock()" 
                [disabled]="isProcessing || balance < 1"
                class="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary-600 disabled:bg-base-twee-300 transition-all flex items-center justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd" />
          </svg>
          Send Message (1 Credit)
        </button>

        <p *ngIf="balance < 1" class="text-xs text-accent-500 mt-2">
           You have 0 credits. <a href="/dashboard/credits" class="underline font-bold">Buy more</a>
        </p>
      </div>

      <div *ngIf="isUnlocked" class="flex flex-col items-center justify-center py-4">
         <div class="h-12 w-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
         </div>
         <p class="font-bold text-base-twee-900">Chat Unlocked!</p>
         <p class="text-sm text-base-twee-600 mb-4">You can now message this landlord freely.</p>
         <button class="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-600 text-sm">
            Open Chat
         </button>
      </div>
    </div>
  `,
  styles: []
})
export class TenantChatUnlockComponent implements OnInit {
  @Input() propertyId!: number;
  @Output() chatOpened = new EventEmitter<void>();

  balance: number = 0;
  isUnlocked: boolean = false;
  isProcessing: boolean = false;

  constructor(private creditService: CreditService) {}

  ngOnInit() {
    this.creditService.balance$.subscribe(b => this.balance = b);
  }

  unlock() {
    this.isProcessing = true;
    this.creditService.unlockChat(this.propertyId).subscribe(success => {
      this.isProcessing = false;
      if (success) {
        this.isUnlocked = true;
        this.chatOpened.emit();
      } else {
        alert('Could not unlock chat. Please check your balance.');
      }
    });
  }
}
