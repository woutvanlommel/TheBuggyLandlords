import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
  <footer class="bg-base-twee">
    <div class="flex">
      <div>
        <!--logo+bijkomende info-->
      </div>
      <div id="navigationMidden" class="flex flex-col gap-4">
        <!-- Dashboard -->
        <a routerLink="/dashboard" class="cursor-pointer relative flex items-center justify-center gap-2 mx-auto text-lg font-semibold text-gray-800 transition-all duration-300 group hover:-translate-y-1">
          <span class="relative">
            Dashboard
            <span class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </span>
          <svg class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" fill="currentColor"></path>
          </svg>
        </a>

        <!-- Profile -->
        <a routerLink="/profile" class="cursor-pointer relative flex items-center justify-center gap-2 mx-auto text-lg font-semibold text-gray-800 transition-all duration-300 group hover:-translate-y-1">
          <span class="relative">
            Profile
            <span class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </span>
          <svg class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" fill="currentColor"></path>
          </svg>
        </a>

        <!-- Credits -->
        <a routerLink="/credits" class="cursor-pointer relative flex items-center justify-center gap-2 mx-auto text-lg font-semibold text-gray-800 transition-all duration-300 group hover:-translate-y-1">
          <span class="relative">
            Credits
            <span class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </span>
          <svg class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" fill="currentColor"></path>
          </svg>
        </a>

        <!-- FAQ -->
        <a routerLink="/faq" class="cursor-pointer relative flex items-center justify-center gap-2 mx-auto text-lg font-semibold text-gray-800 transition-all duration-300 group hover:-translate-y-1">
          <span class="relative">
            FAQ
            <span class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
          </span>
          <svg class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90" viewBox="0 0 16 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z" fill="currentColor"></path>
          </svg>
        </a>
      </div>
      <div>
        <button></button>
      </div>
    </div>  
  </footer>
  `,
  styles: `` ,
})
export class Footer {

}
