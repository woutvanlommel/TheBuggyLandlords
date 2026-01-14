import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../shared/credit.service';
import { VerhuurderService } from '../../shared/verhuurder.service';

interface MyProperty {
  id: number;
  title: string;
  address: string;
  isSpotlightActive: boolean;
  image: string;
}

@Component({
  selector: 'app-landlord-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-4">
      <div *ngFor="let prop of properties" class="bg-base-een-100 border border-base-twee-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        
        <!-- Left: Image & Info -->
        <div class="flex items-center gap-4">
           <div class="h-16 w-16 bg-base-een-200 rounded-lg bg-cover bg-center" [style.backgroundImage]="'url(' + prop.image + ')'"></div>
           <div>
              <h4 class="font-bold text-base-twee-900">{{ prop.title }}</h4>
              <p class="text-sm text-base-twee-600">{{ prop.address }}</p>
           </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex flex-col items-end gap-2">
           <label class="relative inline-flex items-center cursor-pointer">
             <input type="checkbox" 
                    [(ngModel)]="prop.isSpotlightActive" 
                    (change)="onToggle(prop)" 
                    [disabled]="balance < 1 && !prop.isSpotlightActive"
                    class="sr-only peer">
             <div class="w-11 h-6 bg-base-twee-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-base-twee-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
             <span class="ml-3 text-sm font-medium text-base-twee-900" 
                   [ngClass]="{'opacity-50': balance < 1 && !prop.isSpotlightActive}">
               Spotlight
             </span>
           </label>
           
           <span *ngIf="prop.isSpotlightActive" class="text-xs text-accent-600 font-semibold bg-accent-100 px-2 py-1 rounded">
             -1 Credit/day
           </span>
        </div>
      </div>

      <div *ngIf="balance < 1" class="bg-accent-100/30 border border-accent-200 text-accent-700 p-3 rounded-lg text-sm flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
        Your balance is too low to activate new spotlights.
      </div>

      <div *ngIf="properties.length === 0" class="text-center py-8 text-base-twee-500 text-sm">
        No properties found to spotlight.
      </div>
    </div>
  `,
  styles: []
})
export class LandlordSpotlightComponent implements OnInit {
  balance: number = 0;
  properties: MyProperty[] = [];

  constructor(
    private creditService: CreditService,
    private verhuurderService: VerhuurderService
  ) {}

  ngOnInit() {
    this.creditService.balance$.subscribe(b => this.balance = b);
    this.loadProperties();
  }

  async loadProperties() {
    try {
      const buildings = await this.verhuurderService.getMyBuildings();
      // Basic mapping from building to UI property
      this.properties = buildings.map((b: any) => ({
        id: b.id,
        title: b.name || `${b.street} ${b.number}`,
        address: `${b.city}, ${b.postal_code}`,
        isSpotlightActive: !!b.is_spotlight_active,
        image: b.image_url || 'assets/placeholder-room.jpg'
      }));
    } catch (e) {
      console.error('Failed to load landlord properties', e);
    }
  }

  onToggle(prop: MyProperty) {
    this.creditService.toggleSpotlight(prop.id, prop.isSpotlightActive).subscribe(success => {
      // If server rejects, revert toggle
      if (!success) {
        prop.isSpotlightActive = !prop.isSpotlightActive;
        alert('Could not update spotlight status. Check your credits.');
      }
    });
  }
}
