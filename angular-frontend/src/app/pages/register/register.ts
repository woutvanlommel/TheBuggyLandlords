import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonHome } from '../../button-home/button-home';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, ButtonHome],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-primary-500 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg relative">
        <div class="absolute top-4 right-4">
          <app-button-home></app-button-home>
        </div>
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-primary">Account aanmaken</h2>
          <p class="mt-2 text-center text-sm text-base-een-800">
            Of
            <a routerLink="/login" class="font-medium text-accent hover:text-accent-600">
              log in als je al een account hebt
            </a>
          </p>
        </div>

        <form class="mt-8 space-y-6" (ngSubmit)="register()">
          <!-- Student of Verhuurder Keuze -->
          <div class="w-full">
            <label for="role" class="block text-sm font-medium text-base-een-700"
              >Registreren als</label
            >
            <select
              id="role"
              name="role"
              [(ngModel)]="role"
              required
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-base-een-300 bg-accent-100 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm rounded-md cursor-pointer"
            >
              <option value="1">Huurder</option>
              <option value="2">Verhuurder</option>
            </select>
          </div>

          <!-- Naam Sectie -->
          <div class="flex gap-4">
            <div class="w-1/2">
              <label for="fname" class="block text-sm font-medium text-base-een-700"
                >Voornaam</label
              >
              <input
                type="text"
                id="fname"
                name="fname"
                [(ngModel)]="fname"
                required
                class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-een-300 placeholder-base-een-500 text-base-een-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
              />
            </div>
            <div class="w-1/2">
              <label for="name" class="block text-sm font-medium text-base-een-700"
                >Achternaam</label
              >
              <input
                type="text"
                id="name"
                name="name"
                [(ngModel)]="name"
                required
                class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-een-300 placeholder-base-een-500 text-base-een-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
              />
            </div>
          </div>

          <!-- Contact Sectie -->
          <div>
            <label for="email" class="block text-sm font-medium text-base-een-700"
              >Emailadres</label
            >
            <input
              type="email"
              id="email"
              name="email"
              [(ngModel)]="email"
              required
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-een-300 placeholder-base-een-500 text-base-een-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-base-een-700"
              >Telefoonnummer</label
            >
            <input
              type="tel"
              id="phone"
              name="phone"
              [(ngModel)]="phone"
              required
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-een-300 placeholder-base-een-500 text-base-een-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            />
          </div>

          <!-- Wachtwoord Sectie -->
          <div>
            <label for="password" class="block text-sm font-medium text-base-een-700"
              >Wachtwoord</label
            >
            <input
              type="password"
              id="password"
              name="password"
              [(ngModel)]="password"
              required
              minlength="8"
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-een-300 placeholder-base-een-500 text-base-een-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            />
          </div>

          <div>
            <label for="password_confirmation" class="block text-sm font-medium text-base-een-700"
              >Bevestig Wachtwoord</label
            >
            <input
              type="password"
              id="password_confirmation"
              name="password_confirmation"
              [(ngModel)]="password_confirmation"
              required
              class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-base-een-300 placeholder-base-een-500 text-base-een-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
            />
            @if (password !== password_confirmation && password_confirmation) {
            <p class="text-red-500 text-xs mt-1">Wachtwoorden komen niet overeen.</p>
            }
          </div>

          <!-- Error Message -->
          @if (errorMessage) {
          <div class="rounded-md bg-red-50 p-4 border border-red-200">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
              </div>
            </div>
          </div>
          }

          <!-- Submit Button -->
          <div>
            <button
              type="submit"
              [disabled]="!isValid()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition duration-150 ease-in-out"
            >
              Registreren
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class Register {
  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {}

  role: number = 1; // Standaard naar 'Huurder'
  fname: string = '';
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  password_confirmation: string = '';

  errorMessage: string = '';

  isValid(): boolean {
    return (
      this.fname !== '' &&
      this.name !== '' &&
      this.email !== '' &&
      this.phone !== '' &&
      this.password.length >= 8 &&
      this.password === this.password_confirmation
    );
  }

  async register() {
    this.errorMessage = '';

    if (!this.isValid()) {
      this.errorMessage = 'Controleer alle velden.';
      return;
    }

    const payload = {
      role: this.role,
      fname: this.fname,
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    try {
      await this.authService.register(payload);
      // Redirect to dashboard on success (auto-login happens in service if token returned)
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    } catch (error: any) {
      this.ngZone.run(() => {
        this.errorMessage = error.message || 'Registratie mislukt. Probeer het later opnieuw.';
      });
      console.error(error);
    }
  }
}
