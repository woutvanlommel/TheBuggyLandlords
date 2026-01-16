import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-home-search',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="flex items-center gap-2 w-full relative">
    <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Zoek naar koten, steden of straten..." class="flex-1 rounded-l-md rounded-r-md sm:rounded-r-none bg-white/90 backdrop-blur border-none px-5 py-4 text-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-200 text-gray-800 placeholder-gray-500"/>
    <button (click)="search()" class="bg-accent text-white font-bold text-lg px-8 py-4 rounded-r-md hidden sm:block hover:bg-accent-600 transition-colors cursor-pointer shadow-xl">
      ZOEK
    </button>
  </div>`,
  styles: [``],
})
export class AppHomeSearch {
  searchTerm: string = '';
  
  constructor(private router: Router) {}

  search(){
    if (!this.searchTerm) return;

    this.router.navigate(['/kotcompass/rooms'], { queryParams: { search: this.searchTerm } });
  }
}
