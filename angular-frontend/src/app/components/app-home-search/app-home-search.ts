import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-app-home-search',
  imports: [CommonModule, FormsModule],
  template: `
  <div class="flex items-center gap-2 w-full relative">
    <input type="text" [(ngModel)]="searchTerm" (keyup.enter)="search()" placeholder="Zoek naar koten, steden of straten..." class="flex-1 rounded-l-md rounded-r-md sm:rounded-r-gone bg-white/80 border border-primary/30 px-5 py-3 text-lg shadow focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"/>
    <button (click)="search()" class="g-primary text-white px-6 py-3 rounded-r-md hidden sm:block">
      zoek
    </button>
  </div>`,
  styles: [``],
})
export class AppHomeSearch {
  searchTerm: string = '';
  Router: any;

  search(){
    if (!this.searchTerm) return;

    this.Router.navigate(['/rooms'], { queryParams: { q: this.searchTerm } });
  }
}
