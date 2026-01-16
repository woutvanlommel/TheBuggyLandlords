import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { RoomService } from '../../shared/room.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomCard } from '../../components/room-card/room-card';
import { ContactCard } from '../../components/contact-card/contact-card';
import { PriceAdresKotpage } from '../../components/price-adres-kotpage/price-adres-kotpage';
import { ImagesKotpage } from '../../components/images-kotpage/images-kotpage';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule, ContactCard, PriceAdresKotpage, ImagesKotpage],
  template: `
    @if (isLoading) {
      <div><p>Laden...</p></div>
    } @else if (hasError) {
      <div class="text-red-600">Kamer niet gevonden of fout bij ophalen.</div>
    } @else if (room && room.id) {
      <div class="w-full max-w-7xl px-6 mx-auto my-4 flex flex-col gap-6 items-center">
        <!-- Price & Address Component -->
        <app-price-adres-kotpage
          class="w-full"
          [name]="room.roomtype || 'Kamer'"
          [street]="room.building?.street?.street"
          [houseNumber]="room.building?.housenumber"
          [postalCode]="room.building?.place?.zipcode"
          [city]="room.building?.place?.place"
          [type]="room.roomtype || 'Onbekend'"
          [surface]="room.surface || 0"
          [priceType]="'per maand'"
          [price]="totalPrice"
        >
        </app-price-adres-kotpage>

        <!--Room images-->
        <div class="w-full h-96 flex justify-center">
          <app-images-kotpage [images]="room.documents || []"></app-images-kotpage>
        </div>

        <!-- Contact Card: owner is the landlord -->
        <app-contact-card
          [user]="room.building?.owner"
          [roomId]="room.id"
          [isSpotlighted]="room.is_highlighted"
          [isUnlocked]="room.is_unlocked"
          (unlocked)="refreshData()"
        >
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

  get totalPrice(): number {
    if (!this.room) return 0;
    let total = Number(this.room.price) || 0;

    // Check extra_costs (mapped from extraCosts relation)
    if (this.room.extra_costs && Array.isArray(this.room.extra_costs)) {
      this.room.extra_costs.forEach((cost: any) => {
        // Check pivot data
        if (cost.pivot && cost.pivot.price) {
          total += Number(cost.pivot.price);
        }
      });
    }
    return total;
  }

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
