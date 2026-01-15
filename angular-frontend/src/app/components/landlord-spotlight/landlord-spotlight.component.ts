import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditService } from '../../shared/credit.service';
import { VerhuurderService } from '../../shared/verhuurder.service';

interface MyProperty {
  id: number;
  title: string;
  isSpotlightActive: boolean;
  image: string;
  expiresAt: string | null;  // New field
}

interface BuildingGroup {
  address: string;
  city: string;
  rooms: MyProperty[];
  isCollapsed: boolean; // New field
}

@Component({
  selector: 'app-landlord-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      
      <!-- Loading State -->
      <div *ngIf="isLoading" class="p-8 text-center text-base-twee-500 animate-pulse">
        Loading properties...
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && buildingGroups.length === 0" class="p-8 text-center text-base-twee-500 bg-white/50 rounded-xl border border-dashed border-base-twee-300">
        No properties found.
      </div>

      <!-- Loop over Buildings -->
      <div *ngFor="let group of buildingGroups" class="bg-white/50 border border-base-twee-200 rounded-2xl shadow-sm overflow-hidden">
         
         <!-- Building Header (Click to collapse) -->
         <div (click)="group.isCollapsed = !group.isCollapsed" 
              class="flex items-center justify-between p-4 cursor-pointer hover:bg-base-een-100/50 transition-colors border-b border-base-twee-100 select-none">
            <div class="flex items-center gap-3">
              <div class="bg-primary-100 text-primary-600 p-2 rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                 </svg>
              </div>
              <div>
                 <h3 class="text-lg font-bold text-base-twee-900">{{ group.address }}</h3>
                 <p class="text-sm text-base-twee-500">{{ group.city }}</p>
              </div>
            </div>
            
            <!-- Chevron Icon -->
            <div class="text-base-twee-400 transition-transform duration-200" [class.rotate-180]="group.isCollapsed">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
               </svg>
            </div>
         </div>

         <!-- Rooms List (Hidden if collapsed) -->
         <div *ngIf="!group.isCollapsed" class="p-4 space-y-3 bg-white/30">
            <div *ngFor="let prop of group.rooms" class="bg-white border border-base-twee-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
              
              <!-- Left: Image & Info -->
              <div class="flex items-center gap-4">
                 <div class="h-12 w-12 bg-base-een-200 rounded-lg bg-cover bg-center text-xs text-center flex items-center justify-center text-gray-400 shrink-0" 
                      [style.backgroundImage]="prop.image ? 'url(' + prop.image + ')' : ''"
                      [class.bg-gray-100]="!prop.image">
                      <span *ngIf="!prop.image">No Img</span>
                 </div>
                 <div>
                    <h4 class="font-bold text-base-twee-900">{{ prop.title }}</h4>
                    <!-- Spotlight Status + Timer -->
                    <div *ngIf="prop.isSpotlightActive" class="mt-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                       <span class="text-xs text-accent-600 font-bold inline-flex items-center gap-1 bg-accent-50 px-2 py-0.5 rounded-full border border-accent-100">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>
                          Active
                       </span>
                       <span *ngIf="prop.expiresAt" class="text-xs text-base-twee-500 font-medium">
                          Expires in: <span class="text-base-twee-700 font-semibold">{{ getRemainingTime(prop.expiresAt) }}</span>
                       </span>
                    </div>
                 </div>
              </div>

              <!-- Right: Actions -->
              <div class="flex flex-col items-end gap-2">
                  <div *ngIf="!prop.isSpotlightActive">
                     <button (click)="openSpotlightModal(prop)" 
                             [disabled]="balance < 1"
                             class="flex items-center gap-2 px-3 py-1.5 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Promote
                     </button>
                  </div>

                  <div *ngIf="prop.isSpotlightActive">
                     <button (click)="deactivateSpotlight(prop)" 
                             class="text-xs text-base-twee-500 hover:text-accent-600 underline">
                        Turn Off
                     </button>
                  </div>
              </div>
            </div>
         </div>
      </div>

      <!-- Warning if Low Balance -->
      <div *ngIf="balance < 1" class="bg-accent-100/30 border border-accent-200 text-accent-700 p-3 rounded-lg text-sm flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
        To promote properties, you need at least 1 credit.
      </div>

      <div *ngIf="buildingGroups.length === 0" class="text-center py-8 text-base-twee-500 text-sm bg-base-een-100 rounded-xl border border-dashed border-base-twee-300">
        No properties found to spotlight.
      </div>

      <!-- Spotlight Duration Modal -->
      <div *ngIf="selectedProp" class="fixed inset-0 z-9999 flex items-center justify-center p-4" style="position: fixed;">
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" (click)="closeModal()"></div>
          
          <!-- Modal Content -->
          <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative z-10 animate-in fade-in zoom-in duration-200 scale-100 max-h-[90vh] overflow-y-auto">
              <h3 class="text-xl font-bold text-base-twee-900 mb-2">Promote Room {{selectedProp.title}}</h3>
              <p class="text-sm text-base-twee-600 mb-6 leading-relaxed">
                Choose how long you want to highlight this room.
                <br><span class="text-xs font-semibold text-primary block mt-1">Rate: 1 Credit = 1 Day</span>
              </p>
              
              <div class="mb-6 space-y-3">
                 <label class="block text-sm font-bold text-base-twee-800">Duration (Days)</label>
                 <div class="flex items-center gap-3">
                    <button (click)="spotlightDays = spotlightDays > 1 ? spotlightDays - 1 : 1" class="w-10 h-10 rounded-lg border border-base-twee-300 flex items-center justify-center hover:bg-base-een-100 text-lg font-bold text-base-twee-600">-</button>
                    <input type="number" [(ngModel)]="spotlightDays" min="1" [max]="balance" 
                           class="flex-1 text-center font-bold text-lg py-2 border border-base-twee-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
                    <button (click)="spotlightDays = spotlightDays < balance ? spotlightDays + 1 : balance" class="w-10 h-10 rounded-lg border border-base-twee-300 flex items-center justify-center hover:bg-base-een-100 text-lg font-bold text-base-twee-600">+</button>
                 </div>

                 <div class="flex justify-between items-center text-sm bg-base-een-50 p-3 rounded-lg border border-base-twee-100 mt-2">
                    <span class="text-base-twee-600">Total Cost:</span>
                    <span class="font-bold text-lg" [ngClass]="{'text-accent-600': spotlightDays > balance, 'text-primary-700': spotlightDays <= balance}">
                       {{ spotlightDays }} Credits
                    </span>
                 </div>
                 <div class="text-right text-xs text-base-twee-500 font-medium">
                    Available: {{ balance }}
                 </div>
              </div>

              <div class="flex items-center gap-3 mt-6">
                  <button (click)="closeModal()" class="flex-1 px-4 py-2.5 text-base-twee-600 font-semibold hover:bg-base-een-100 rounded-lg transition-colors">
                     Cancel
                  </button>
                  <button (click)="confirmSpotlight()" 
                          [disabled]="!spotlightDays || spotlightDays < 1 || spotlightDays > balance"
                          class="flex-1 px-4 py-2.5 bg-primary text-white font-bold rounded-lg shadow-lg shadow-primary/30 hover:bg-primary-600 hover:translate-y-1px active:translate-y-1px transition-all disabled:opacity-50 disabled:shadow-none disabled:transform-none">
                     Activate
                  </button>
              </div>
          </div>
      </div>
    </div>
  `,
  styles: []
})
export class LandlordSpotlightComponent implements OnInit {
  balance: number = 0;
  buildingGroups: BuildingGroup[] = [];
  isLoading: boolean = true;
  
  // Modal State
  selectedProp: MyProperty | null = null;
  spotlightDays: number = 1;

  constructor(
    private creditService: CreditService,
    private verhuurderService: VerhuurderService
  ) {}

  ngOnInit() {
    this.creditService.balance$.subscribe(b => this.balance = b);
    this.loadProperties();
  }

  async loadProperties() {
    this.isLoading = true;
    try {
      const buildings = await this.verhuurderService.getMyBuildings();
      
      this.buildingGroups = buildings.map((b: any) => {
         const rooms = (b.rooms || []).map((r: any) => ({
              id: r.id, 
              title: `${r?.roomnumber}`, 
              isSpotlightActive: !!r.is_highlighted,
              image: r?.images && r.images.length > 0 ? r.images[0].path : '',
              expiresAt: r.highlight_expires_at // Map raw timestamp
         }));

         return {
            address: `${b?.street?.street} ${b?.housenumber}`,
            city: b?.place ? `${b.place.place} ${b.place.zipcode}` : '',
            rooms: rooms,
            isCollapsed: false // Default open
         };
      }).filter((g: any) => g.rooms.length > 0); 

    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
    }
  }

  // Calculate generic remaining time string
  getRemainingTime(expiryDate: string): string {
    if (!expiryDate) return '';
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expired';

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days} days, ${hours} hours`;
    if (hours > 0) return `${hours} hours`;
    return '< 1 hour';
  }

  openSpotlightModal(prop: MyProperty) {
    this.selectedProp = prop;
    this.spotlightDays = 1; 
  }

  closeModal() {
    this.selectedProp = null;
  }

  confirmSpotlight() {
    if(!this.selectedProp || this.spotlightDays < 1) return;

    this.creditService.activateSpotlight(this.selectedProp.id, this.spotlightDays)
      .subscribe(success => {
         if (success) {
            // Optimistic update of expiry date
            if (this.selectedProp) {
                this.selectedProp.isSpotlightActive = true;
                const newExpiry = new Date();
                newExpiry.setDate(newExpiry.getDate() + this.spotlightDays);
                this.selectedProp.expiresAt = newExpiry.toISOString();
            }
            this.closeModal();
         }
      });
  }

  deactivateSpotlight(prop: MyProperty) {
    if(!confirm('Are you sure you want to remove the spotlight from this property?')) return;
    
    this.creditService.toggleSpotlight(prop.id, false).subscribe(success => {
       if (success) {
         prop.isSpotlightActive = false;
       }
    });
  }
}
