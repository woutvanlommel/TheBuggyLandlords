import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoomService } from '../../shared/room.service';

@Component({
  selector: 'app-app-city-tiles',
  imports: [CommonModule],
  template: `
  <div class="w-full max-w-7xl mx-auto px-4 mt-8">
    <h2 class="text-2xl font-bold mb-6 text-gray-800">Populaire Studentensteden</h2>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div *ngFor="let city of cities" 
           (click)="goToCity(city)"
           class="group cursor-pointer bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:shadow-lg hover:border-primary hover:-translate-y-1">
        
        <div class="flex items-center justify-between">
          <span class="font-semibold text-gray-700 group-hover:text-primary transition-colors">{{ city.name }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
        
      </div>
    </div>
  </div>`,
  styles: ``,
})
export class AppCityTiles {
  private router = inject(Router);
  private roomService = inject(RoomService);

  cities = [
    { name: 'Leuven', lat: 50.8798, lng: 4.7005 },
    { name: 'Gent', lat: 51.0543, lng: 3.7174 },
    { name: 'Antwerpen', lat: 51.2194, lng: 4.4025 },
    { name: 'Hasselt', lat: 50.9307, lng: 5.3325 },
    { name: 'Brussel', lat: 50.8503, lng: 4.3517 },
    { name: 'Brugge', lat: 51.2093, lng: 3.2247 },
    { name: 'Kortrijk', lat: 50.8280, lng: 3.2649 },

  ];

  goToCity(city: any) {
    // 1. Update Map Center in Service
    this.roomService.setMapCenter(city.lat, city.lng, 14);
    
    // 2. Navigate to Map Page
    this.router.navigate(['/kotcompass/rooms'], {
      queryParams: { 
        lat: city.lat, 
        lng: city.lng, 
        city: city.name 
      }
    });
  }

}
