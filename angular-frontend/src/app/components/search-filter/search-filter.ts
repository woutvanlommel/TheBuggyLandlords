import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  template: `
 <div class="w-full bg-white border-b border-gray-200 p-3 lg:px-6 lg:py-3 flex flex-col lg:flex-row gap-3 lg:items-center shadow-sm z-30 relative">
  
  <!-- Group 1: Search (Takes available space) -->
  <div class="flex items-center gap-2 w-full lg:flex-1 min-w-0">
    <div class="relative grow text-gray-400 focus-within:text-accent transition-colors">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input
        type="text"
        [(ngModel)]="query"
        (keyup.enter)="onFilterClick()"
        class="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl py-2 pl-9 pr-3 focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none text-sm placeholder-gray-400"
        placeholder="Search location..."
      />
    </div>
    
    <button 
      (click)="onFilterClick()"
      class="p-2 bg-primary text-white rounded-xl hover:bg-primary-600 transition-colors shadow-sm shrink-0 lg:hidden"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
    </button>
  </div>

  <!-- Group 2: Filters (Horizontal on desktop) -->
  <div class="flex flex-wrap lg:flex-nowrap items-center gap-2 w-full lg:w-auto">
    
    <!-- Selects Wrapper -->
    <div class="flex gap-2 w-full lg:w-auto">
      <!-- City Select -->
      <div class="relative grow lg:grow-0 lg:w-32">
        <select 
          [(ngModel)]="selectedCity"
          (change)="onFilterClick()"
          class="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 rounded-lg py-2 pl-2.5 pr-8 text-xs font-medium cursor-pointer focus:border-accent focus:ring-1 focus:ring-accent outline-none"
        >
          <option value="">All Cities</option>
          <option *ngFor="let city of cities" [value]="city">{{ city }}</option>
        </select>
        <div class="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>

      <!-- Sort Select -->
      <div class="relative grow lg:grow-0 lg:w-36">
        <select 
          [(ngModel)]="selectedSort"
          (change)="onFilterClick()"
          class="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-700 rounded-lg py-2 pl-2.5 pr-8 text-xs font-medium cursor-pointer focus:border-accent focus:ring-1 focus:ring-accent outline-none"
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

    <!-- Divider for Desktop -->
    <div class="hidden lg:block w-px h-6 bg-gray-200 mx-1"></div>

    <!-- Category Pills -->
    <div class="flex gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar w-full lg:w-auto pt-1 lg:pt-0">
      <button
        *ngFor="let cat of categories"
        (click)="setActiveFilter(cat)"
        [ngClass]="{
          'bg-primary text-white border-primary shadow-sm': activeFilter === cat,
          'bg-white text-gray-600 border-gray-200 hover:bg-gray-50': activeFilter !== cat
        }"
        class="px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wide border transition-all whitespace-nowrap shrink-0"
      >
        {{ cat }}
      </button>
    </div>
    
    <!-- Desktop Search Button (Icon only) -->
    <button 
      (click)="onFilterClick()"
      class="hidden lg:flex p-2 bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm ml-1"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/></svg>
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
