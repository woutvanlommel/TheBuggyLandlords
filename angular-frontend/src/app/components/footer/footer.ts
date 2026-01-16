import { Component, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NewsletterService } from '../../services/newsletter';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <footer class="bg-base-twee py-2">
      <div
        id="footerContainer"
        class="container mx-auto flex flex-col lg:flex-row justify-between items-center gap-4"
      >
        <!-- Left Section -->
        <div
          id="navigationleft"
          class=" p-10 font-sans w-full min-h-75 flex flex-col justify-center items-center lg:items-start lg:w-1/3"
        >
          <h1 class="text-5xl font-light text-base-twee-900 tracking-tight mb-4">
            <img
              src="/assets/logo/2.400pxX100pxLogoBovenoranje.png"
              alt="KotCompass logo"
              class="h-12 w-auto"
              loading="lazy"
            />
          </h1>
          <div class="max-w-md">
            <p class="text-lg text-base-twee-900 leading-relaxed">
              Vind, beheer en optimaliseer je studentenhuisvesting in één platform. KotCompass helpt verhuurders en studenten sneller te matchen.
            </p>
          </div>
        </div>

        <!-- Middle Section -->
        <div
          id="navigationMiddle"
          class="flex flex-col w-full lg:w-1/3 items-start justify-center pl-10"
        >
          <!-- KOTCOMPASS  -->
          <a
            routerLink="/kotcompass"
            class="focus:outline-none cursor-pointer relative flex items-center justify-start gap-6 text-xl font-bold text-gray-900 transition-all duration-300 group hover:-translate-y-1 mb-1"
          >
            <span class="w-32">
              <span class="relative inline-block">
                KOTCOMPASS
                <span
                  class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </span>
            <svg
              class="w-7 h-7 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>

          <!-- Dashboard -->
          <a
            routerLink="/dashboard"
            class="focus:outline-none cursor-pointer relative flex items-center justify-start gap-6 text-lg text-gray-800 transition-all duration-300 group hover:-translate-y-1"
          >
            <span class="w-32">
              <span class="relative inline-block">
                Dashboard
                <span
                  class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </span>
            <svg
              class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>

          <!-- Profile -->
          <a
            routerLink="/profile"
            class="focus:outline-none cursor-pointer relative flex items-center justify-start gap-6 text-lg text-gray-800 transition-all duration-300 group hover:-translate-y-1"
          >
            <span class="w-32">
              <span class="relative inline-block">
                Profile
                <span
                  class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </span>
            <svg
              class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>

          <!-- Credits -->
          <a
            routerLink="/credits"
            class="focus:outline-none cursor-pointer relative flex items-center justify-start gap-6 text-lg text-gray-800 transition-all duration-300 group hover:-translate-y-1"
          >
            <span class="w-32">
              <span class="relative inline-block">
                Credits
                <span
                  class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </span>
            <svg
              class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>

          <!-- FAQ -->
          <a
            routerLink="/kotcompass/faq"
            class="focus:outline-none cursor-pointer relative flex items-center justify-start gap-6 text-lg text-gray-800 transition-all duration-300 group hover:-translate-y-1"
          >
            <span class="w-32">
              <span class="relative inline-block">
                FAQ
                <span
                  class="absolute bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"
                ></span>
              </span>
            </span>
            <svg
              class="w-6 h-6 transition-transform duration-300 ease-linear rotate-45 group-hover:rotate-90"
              viewBox="0 0 16 19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                fill="currentColor"
              ></path>
            </svg>
          </a>
        </div>

        <!-- Right Section -->
        <div
          id="navigationRight"
          class="p-6 rounded-2xl w-full lg:w-1/3 max-w-sm flex flex-col items-center lg:items-end"
        >
          <div class="w-full">
            <h3 class="text-xl font-bold font-sans text-base-twee-900 mb-2">Nieuwsbrief</h3>
            <p class="text-base-twee-700 text-sm mb-4">
              Blijf op de hoogte van nieuwe aanbiedingen, platform updates en tips voor verhuurders.
            </p>

            <form class="relative w-full" method="post" (ngSubmit)="onSubscribe($event)">
              <input
                type="email"
                name="email"
                [(ngModel)]="userEmail"
                required
                placeholder="@ geef je email in.."
                class="w-full pl-4 pr-14 py-3 bg-base-een-100 rounded-full text-base-twee-900 placeholder-base-twee-400 shadow-sm focus:outline-none"
              />
              <button
                type="submit"
                class="absolute right-1.5 top-1.5 h-9 w-9 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                [disabled]="!userEmail || isLoading"
              >
                @if (isLoading) {
                  <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                } @else {
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-5 h-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                }
              </button>
            </form>
          </div>
        </div>
      </div>
      <div class="border-t border-gray-200 mt-4 py-4 text-center">
         <p class="text-xs text-base-twee-700">
          &copy; {{ currentYear }} KotCompass. All rights reserved.
        </p>
      </div>
    </footer>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
  `,
})
export class Footer {
  userEmail = '';
  isLoading = false;
  currentYear = new Date().getFullYear();

  constructor(private newsletterService: NewsletterService, private cdr: ChangeDetectorRef) {}

  onSubscribe(event?: Event) {
    if (event) {
      event.preventDefault(); //prevent form submission reload
    }

    if (!this.userEmail || this.isLoading) return;

    this.isLoading = true;

    this.newsletterService.subscribe(this.userEmail).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.userEmail = '';
        this.cdr.detectChanges();
        setTimeout(() => alert('Success! You are subscribed.'), 100);
      },
      error: (err) => {
        this.isLoading = false;
        this.cdr.detectChanges();
        console.error('Full error log:', err);
        const errorMessage = err.error?.message || err.text || err.message || 'Subscription failed';
        setTimeout(() => alert('Error: ' + errorMessage), 100);
      },
    });
  }
}
