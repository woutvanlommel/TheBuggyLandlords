import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  template: `
 <div class="flex flex-col gap-6 w-full max-w-2xl p-4">
  <div class="flex items-center gap-3">
    <div class="relative grow">
      <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input
        type="text"
        [(ngModel)]="query"
        className="w-full bg-gray-100 border-none rounded-full py-3 pl-11 pr-4 focus:ring-2 focus:ring-black transition-all outline-none text-sm"
        placeholder="Search anything..."
      />
    </div>

    <button 
      (click)="onFilterClick()"
      class="p-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shrink-0"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="12" x2="12" y1="18" y2="22"/></svg>
    </button>
  </div>

  <div class="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
    <button
      *ngFor="let cat of categories"
      (click)="setActiveFilter(cat)"
      [ngClass]="{
        'bg-black text-white border-black': activeFilter === cat,
        'bg-white text-gray-600 border-gray-200 hover:border-gray-400': activeFilter !== cat
      }"
      class="px-6 py-2 rounded-full text-xs font-medium border transition-all whitespace-nowrap"
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
  
  categories: string[] = ['All', 'Design', 'Code', 'Resources', 'UI/UX'];

  setActiveFilter(category: string): void {
    this.activeFilter = category;
  }

  onFilterClick(): void {
    console.log('Filter button clicked');
  }
}
