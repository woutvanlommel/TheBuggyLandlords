import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RoomService } from '../../shared/room.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomCard } from '../../components/room-card/room-card';
import { ContactCard } from '../../components/contact-card/contact-card';
import { PriceAdresKotpage } from '../../components/price-adres-kotpage/price-adres-kotpage';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, RoomCard, ContactCard, PriceAdresKotpage],
  template: `
    @if (isLoading) {
    <div><p>Laden...</p></div>
    } @else if (hasError) {
    <div class="text-red-600">Kamer niet gevonden of fout bij ophalen.</div>
    } @else if (room && room.id) {
    <div class="mx-auto w-30/100 my-4 flex flex-col gap-6">
      
      <!-- Price & Address Component -->
      <app-price-adres-kotpage
        [name]="room.roomtype || 'Kamer'"
        [postalCode]="room.building?.place?.zipcode"
        [city]="room.building?.place?.place"
        [type]="room.roomtype || 'Onbekend'"
        [surface]="room.surface || 0"
        [bedrooms]="1"
        [priceType]="'per maand'"
        [price]="room.price">
      </app-price-adres-kotpage>

      <app-room-card [room]="room"></app-room-card>
      
      <!-- Contact Card: owner is the landlord -->
      <app-contact-card 
          [user]="room.building?.owner"

          [roomId]="room.id"
          [isSpotlighted]="room.is_highlighted"
          [isUnlocked]="room.is_unlocked"
          (unlocked)="refreshData()">
      </app-contact-card>
    </div>
    }
  `,
})
export class RoomDetail {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  private cdr = inject(ChangeDetectorRef);
  room: any = null;
  isLoading = true;
  hasError = false;

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      if (!this.room) this.isLoading = true; // only show loading on first load
      this.hasError = false;
      this.roomService.getRoomById(id).subscribe({
        next: (data) => {
          console.log('Kamerdata:', data);
          this.room = data;
          this.isLoading = false;
          this.hasError = false;
          try {
            this.cdr.detectChanges();
          } catch (e) {
            /* ignore */
          }
        },
        error: (err) => {
          console.error('Fout bij ophalen kamer:', err);
          
          if (!this.room) {
             this.room = null;
             this.isLoading = false;
             this.hasError = true;
          }
          try {
            this.cdr.detectChanges();
          } catch (e) {
            /* ignore */
          }
        },
      });
    } else {
      this.isLoading = false;
      this.hasError = true;
    }
  }
}
