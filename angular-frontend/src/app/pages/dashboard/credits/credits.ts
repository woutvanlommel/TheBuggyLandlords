import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-credits',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-8 text-center bg-base-een-100/50 backdrop-blur-sm rounded-xl border border-primary-100/50">
        <h3 class="text-xl font-semibold text-base-twee-900">Mijn Credits</h3>
        <p class="text-base-twee-600 mt-2">Hier komt het overzicht van je credits en verbruik.</p>
        
        <!-- Placeholder content -->
        <div class="mt-6 flex justify-center gap-4">
             <div class="mt-1 mb-3">
                  <span class="text-2xl font-bold text-base-twee-900">0</span>
                  <span class="block text-xs font-semibold text-primary-600">Beschikbaar</span>
             </div>
        </div>
    </div>
  `,
  styles: []
})
export class Credits {}
