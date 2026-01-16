import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RoomService } from '../../shared/room.service';

@Component({
  selector: 'app-app-city-tiles',
  imports: [CommonModule],
  template: `
  <div class="w-full max-w-5xl mx-auto px-4 mt-2 text-center">
    
    
    <div class="flex flex-wrap justify-center gap-2">
      <div *ngFor="let city of cities" 
           (click)="goToCity(city)"
           class="group cursor-pointer bg-white/20 backdrop-blur-md border border-white/30 rounded-md py-2 px-3 transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5 hover:shadow-lg">
        
        <div class="flex items-center gap-2">
          <span class="font-medium text-xs text-white transition-colors">{{ city.name }}</span>
          
          <svg
              class="w-3 h-3 text-white/80 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90 group-hover:text-accent"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                fill="currentColor"
              ></path>
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
