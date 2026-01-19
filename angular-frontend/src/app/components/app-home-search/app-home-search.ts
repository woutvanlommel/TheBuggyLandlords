import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../shared/room.service';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-app-home-search',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="w-full relative group z-50">
    <div class="flex items-center w-full bg-white rounded-full shadow-2xl p-2 transition-all duration-300 ring-4 ring-white/10 focus-within:ring-accent/30 focus-within:scale-[1.02]">
      <div class="pl-4 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <input 
        type="text" 
        [(ngModel)]="searchTerm" 
        (ngModelChange)="onSearchChange($event)"
        (keyup.enter)="search()" 
        placeholder="In welke stad zoek je een kot?" 
        class="flex-1 bg-transparent border-none px-4 py-3 text-lg font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0"
      />
      <button (click)="search()" class="bg-accent text-white font-bold text-lg px-8 py-3 rounded-full hidden sm:flex items-center gap-2 hover:bg-accent-600 transition-all duration-300 shadow-lg hover:shadow-accent/40 cursor-pointer">
        <span>ZOEK</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-5 h-5">
           <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
      <!-- Mobile Search Button (icon only) -->
      <button (click)="search()" class="bg-accent text-white p-3 rounded-full sm:hidden flex items-center justify-center hover:bg-accent-600 transition-colors shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="w-6 h-6">
           <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </div>

    <!-- Autocomplete Dropdown -->
    @if (filteredCities.length > 0) {
    <div class="absolute z-50 left-4 right-4 mt-4 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto animate-fade-in-down">
      @for (city of filteredCities; track city.name) {
      <div 
          (click)="selectCity(city)"
          class="px-6 py-4 hover:bg-orange-50 cursor-pointer flex items-center gap-4 transition-colors border-b border-gray-50 last:border-0 group">
        <div class="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <div class="text-left">
          <span class="font-bold text-gray-800 group-hover:text-accent transition-colors block">{{ city.name }}</span>
          <span class="text-xs text-gray-400">Ga naar kaart</span>
        </div>
      </div>
      }
    </div>
    }
  </div>`,
  styles: [``],
})
export class AppHomeSearch {
  searchTerm: string = '';
  filteredCities: any[] = [];
  
  private router = inject(Router);
  private roomService = inject(RoomService);
  private searchSubject = new Subject<string>();

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) return of([]);
        return this.roomService.searchCities(term).pipe(
          catchError(() => of([]))
        );
      })
    ).subscribe(cities => {
      this.filteredCities = cities;
    });
  }

  onSearchChange(term: string) {
    this.searchSubject.next(term);
  }

  selectCity(city: any) {
    if (!city) return;
    
    this.searchTerm = city.name;
    this.filteredCities = [];
    
    // 1. Update map center
    this.roomService.setMapCenter(city.lat, city.lng, 14);

    // 2. Navigate
    this.router.navigate(['/kotcompass/rooms'], { 
      queryParams: { 
        lat: city.lat, 
        lng: city.lng,
        city: city.name 
      } 
    });
  }

  search(){
    if (!this.searchTerm) return;

    // If there is an exact match in our current suggestions, use it
    const match = this.filteredCities.find(c => c.name.toLowerCase() === this.searchTerm.toLowerCase());
    
    if (match) {
        this.selectCity(match);
    } else {
        // Fallback for generic text search
        this.router.navigate(['/kotcompass/rooms'], { queryParams: { search: this.searchTerm } });
    }
  }
}
