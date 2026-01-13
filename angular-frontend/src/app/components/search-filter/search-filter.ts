import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  template: `
 <div class="flex flex-col gap-3 w-full p-4">
  
  <!-- Top Row: Search Input + Main Action -->
  <div class="flex items-center gap-2">
    <div class="relative grow">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input
        type="text"
        [(ngModel)]="query"
        (keyup.enter)="onFilterClick()"
        class="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-10 pr-3 focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-sm placeholder-gray-400"
        placeholder="Search location..."
      />
    </div>
    
    <button 
      (click)="onFilterClick()"
      class="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
    </button>
  </div>

  <!-- Middle Row: Dropdowns (Compact) -->
  <div class="grid grid-cols-2 gap-2">
    <!-- City Select -->
    <div class="relative">
      <select 
        [(ngModel)]="selectedCity"
        (change)="onFilterClick()"
        class="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs font-medium cursor-pointer focus:border-black focus:ring-0 transition-colors"
      >
        <option value="">All Cities</option>
        <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
      </select>
      <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>

    <!-- Sort Select -->
    <div class="relative">
      <select 
        [(ngModel)]="selectedSort"
        (change)="onFilterClick()"
        class="w-full appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-3 pr-8 text-xs font-medium cursor-pointer focus:border-black focus:ring-0 transition-colors"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low-High</option>
        <option value="price_desc">Price: High-Low</option>
      </select>
      <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
    </div>
  </div>

  <!-- Bottom Row: Category Pills -->
  <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
    <button
      *ngFor="let cat of categories"
      (click)="setActiveFilter(cat)"
      [ngClass]="{
        'bg-black text-white border-black shadow-md': activeFilter === cat,
        'bg-white text-gray-600 border-gray-200 hover:bg-gray-50': activeFilter !== cat
      }"
      class="px-3 py-1.5 rounded-lg text-[11px] font-semibold border transition-all whitespace-nowrap shrink-0"
    >
      {{ cat }}
    </button>
  </div>
</div>
  `,
  styles: ``,
})
export class SearchFilter {
  query: string = '';
  activeFilter: string = 'All';
  selectedCity: string = '';
  selectedSort: string = 'newest';
  
  categories: string[] = ['All', 'Kot', 'Studio', 'Apartment'];
  cities: string[] = ['Antwerpen', 'Gent', 'Leuven', 'Brussel', 'Mechelen', 'Kortrijk'];

  setActiveFilter(category: string): void {
    this.activeFilter = category;
  }

  onFilterClick(): void {
    console.log('Filter:', {
      query: this.query,
      category: this.activeFilter,
      city: this.selectedCity,
      sort: this.selectedSort
    });
  }
}
