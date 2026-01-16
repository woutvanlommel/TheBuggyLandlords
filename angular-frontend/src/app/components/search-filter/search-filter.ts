import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoomService } from '../../shared/room.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of, catchError, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-filter',
  imports: [CommonModule, FormsModule],
  template: `
 <div class="w-full bg-white border-b border-gray-200 p-3 lg:px-6 lg:py-3 flex flex-col lg:flex-row gap-3 lg:items-center shadow-sm z-30 relative">
  
  <!-- Group 1: Search (Takes available space) -->
  <div class="flex items-center gap-2 w-full lg:flex-1 min-w-0 relative">
    <div class="relative grow text-gray-400 focus-within:text-accent transition-colors">
      <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>
      <input
        type="text"
        [(ngModel)]="query"
        (ngModelChange)="onSearchInput($event)"
        (keyup.enter)="onFilterClick()"
        (blur)="onBlur()"
        class="w-full bg-gray-50 text-gray-900 border border-gray-200 rounded-xl py-2 pl-9 pr-3 focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none text-sm placeholder-gray-400"
        placeholder="Search location..."
        autocomplete="off"
      />
      <!-- CUSTOM AUTOCOMPLETE DROPDOWN -->
      <div *ngIf="suggestions.length > 0 && showSuggestions" 
           class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
        <div *ngFor="let suggestion of suggestions"
             (click)="selectSuggestion(suggestion)" 
             class="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 font-medium">
          {{ suggestion }}
        </div>
      </div>
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
          'bg-primary text-white border-primary shadow-sm': isActive(cat),
          'bg-white text-gray-600 border-gray-200 hover:bg-gray-50': !isActive(cat)
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
export class SearchFilter implements OnInit, OnDestroy {
  query: string = '';
  // activeFilter: string = 'All'; // Removed
  activeFilters: string[] = []; // New multi-select
  
  selectedCity: string = '';
  selectedSort: string = 'newest';
  
  categories: string[] = ['All']; // Will be populated dynamically from server
  cities: string[] = ['Antwerpen', 'Gent', 'Leuven', 'Brussel', 'Mechelen', 'Kortrijk', 'Hasselt'];

  private citiesMap: {[key: string]: {lat: number, lng: number}} = {
    'Antwerpen': {lat: 51.2194, lng: 4.4025},
    'Gent': {lat: 51.0543, lng: 3.7174},
    'Leuven': {lat: 50.8798, lng: 4.7005},
    'Brussel': {lat: 50.8503, lng: 4.3517},
    'Mechelen': {lat: 51.0259, lng: 4.4771},
    'Kortrijk': {lat: 50.8280, lng: 3.2649},
    'Hasselt': {lat: 50.9307, lng: 5.3378}
  };

  suggestions: string[] = [];
  showSuggestions: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute
  ) {
    this.searchSubject.pipe(
      takeUntil(this.destroy$), // Clean up
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query || query.length < 2) return of([]);
        return this.roomService.getSearchSuggestions(query).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(suggestions => {
      this.suggestions = suggestions;
      this.showSuggestions = suggestions.length > 0;
    });
  }

  ngOnInit() {

    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      let shouldTriggerSearch = false;

      // somebody search with text (Home Search)
      if (params['q']) {
        this.query = params['q'];
        shouldTriggerSearch = true;
      }

      // Scenario B: Someone clicked on a City Tile
      if (params['city']) {
        this.selectedCity = params['city'];
        shouldTriggerSearch = true;
      }

      // If there was data from the URL, trigger the search directly
      if (shouldTriggerSearch) {
        // Wait a bit so the view is updated (optional, sometimes needed for map init)
        setTimeout(() => this.onFilterClick(), 100);
      }
    });
    // Listen for available types based on location
    this.roomService.availableTypes$.pipe(takeUntil(this.destroy$)).subscribe(types => {
      if (types && types.length > 0) {
        // Keep 'All' plus the dynamic types. 
        // Ensure unique values handling
        const uniqueTypes = [...new Set(types)];
        this.categories = ['All', ...uniqueTypes];
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  selectSuggestion(suggestion: string): void {
    this.query = suggestion;
    this.showSuggestions = false;
    this.onFilterClick();
  }

  onBlur(): void {
    // Small delay to allow click event to fire on suggestions
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  isActive(category: string): boolean {
    if (category === 'All') return this.activeFilters.length === 0;
    return this.activeFilters.includes(category);
  }

  setActiveFilter(category: string): void {
    if (category === 'All') {
      this.activeFilters = [];
    } else {
      const idx = this.activeFilters.indexOf(category);
      if (idx > -1) {
        this.activeFilters.splice(idx, 1);
      } else {
        this.activeFilters.push(category);
      }
    }
    this.onFilterClick();
  }

  onFilterClick(): void {
    // 1. If we have a query, try to center map on it first
    if (this.query && this.query.length > 2) {
      // Check if it's a predefined city
      if (this.citiesMap[this.query]) {
        const c = this.citiesMap[this.query];
        this.roomService.setMapCenter(c.lat, c.lng);
        this.submitFilter();
        return;
      }

      // Try geocoding via backend
      this.roomService.getSearchLocation(this.query).subscribe({
        next: (loc) => {
          if (loc) {
            this.roomService.setMapCenter(loc.lat, loc.lng, loc.zoom);
          }
          this.submitFilter();
        },
        error: () => {
          // If not found, just filter
          this.submitFilter();
        }
      });
      return;
    }

    // 2. Map Center if City Dropdown is selected (and no text query that overrides it)
    if (!this.query) {
      if (this.selectedCity && this.citiesMap[this.selectedCity]) {
        const c = this.citiesMap[this.selectedCity];
        this.roomService.setMapCenter(c.lat, c.lng);
      } else if (!this.selectedCity) {
        // All Cities -> Zoom out to show Belgium (centered on Leuven usually)
        this.roomService.setMapCenter(50.8798, 4.7005, 8);
      }
    }

    this.submitFilter();
  }

  submitFilter(): void {
    this.roomService.updateFilters({
      query: this.query,
      category: this.activeFilters.length > 0 ? this.activeFilters : 'All',
      city: this.selectedCity,
      sort: this.selectedSort
    });
  }
}
