import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-blue-700 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Inloggen</h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Of
            <a routerLink="/register" class="font-medium text-orange-500 hover:text-accent-600">
              maak een nieuw account aan
            </a>
          </p>
        </div>

        @if (errorMessage) {
        <div class="rounded-md bg-red-50 p-4 border border-red-200">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">{{ errorMessage }}</h3>
            </div>
          </div>
        </div>
        }

        <form class="mt-8 space-y-6" (ngSubmit)="login()">
          <div class="rounded-md space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Emailadres</label>
              <input
                type="email"
                id="email"
                name="email"
                [(ngModel)]="email"
                (blur)="checkEmail()"
                (input)="emailCheck = ''"
                required
                class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="test@test.com"
              />
              @if (emailCheck) {
              <p class="text-red-500 text-xs mt-1">{{ emailCheck }}</p>
              }
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700"
                >Wachtwoord</label
              >
              <input
                type="password"
                id="password"
                name="password"
                [(ngModel)]="password"
                (blur)="checkPassword()"
                (input)="passwordCheck = ''"
                required
                class="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm transition duration-150 ease-in-out"
                placeholder="password"
              />
              @if (passwordCheck) {
              <p class="text-red-500 text-xs mt-1">{{ passwordCheck }}</p>
              }
            </div>
          </div>

          <div>
            <button
              type="submit"
              [disabled]="!isValid()"
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out cursor-pointer"
            >
              Inloggen
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
})
export class Login {
  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {}

  email: string = '';
  password: string = '';

  passwordCheck: string = '';
  emailCheck: string = '';
  errorMessage: string = '';

  checkEmail() {
    if (!this.email) {
      this.emailCheck = 'Email is verplicht';
    } else if (!this.email.includes('@')) {
      this.emailCheck = 'Ongeldig emailadres';
    } else {
      this.emailCheck = '';
    }
  }

  checkPassword() {
    if (!this.password) {
      this.passwordCheck = 'Wachtwoord is verplicht';
    } else {
      this.passwordCheck = '';
    }
  }

  isValid(): boolean {
    return !!this.email && this.email.includes('@') && !!this.password;
  }

  async login() {
    this.errorMessage = '';

    this.checkEmail();
    this.checkPassword();

    if (this.emailCheck || this.passwordCheck) {
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      // Redirect to dashboard on success
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard']);
      });
    } catch (error: any) {
      // Forceer update binnen Angular zone
      this.ngZone.run(() => {
        this.errorMessage = error.message || 'Inloggen mislukt. Controleer uw inloggegevens.';
      });
      console.error(error);
    }
  }
}
