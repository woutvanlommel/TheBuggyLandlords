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
    <div class="flex items-center gap-2 w-full">
      <input 
        type="text" 
        [(ngModel)]="searchTerm" 
        (ngModelChange)="onSearchChange($event)"
        (keyup.enter)="search()" 
        placeholder="Zoek naar steden..." 
        class="flex-1 rounded-l-md rounded-r-md sm:rounded-r-none bg-white/90 backdrop-blur border-none px-6 py-4 text-lg font-semibold shadow-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 text-gray-800 placeholder-gray-500"
      />
      <button (click)="search()" class="bg-accent text-white font-bold text-lg px-8 py-4 rounded-r-md hidden sm:block hover:bg-accent-600 transition-colors cursor-pointer shadow-xl">
        ZOEK
      </button>
    </div>

    <!-- Autocomplete Dropdown -->
    @if (filteredCities.length > 0) {
    <div class="absolute z-50 left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto">
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
