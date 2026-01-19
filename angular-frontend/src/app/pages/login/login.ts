import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonHome } from '../../components/app-city-tiles/button-home/button-home';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, ButtonHome],
  template: `
    <div class="min-h-screen flex w-full bg-white font-sans">
      
      <!-- Left Side: Image & Branding (Desktop Only) -->
      <div class="hidden lg:flex w-1/2 relative bg-primary-900 overflow-hidden">
        <!-- Background Image -->
        <div 
          class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style="background-image: url('/assets/img/hero-bg.jpg');"
        ></div>
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-linear-to-t from-primary-900 via-primary-900/40 to-transparent"></div>

        <!-- Content -->
        <div class="relative z-10 w-full flex flex-col justify-between p-12 h-screen">
            <div>
              <img src="/assets/logo/400pxX100pxLogoLiggendVolledigOranje.png" alt="KotCompass" class="h-16 w-auto mb-6">
            </div>
            
            <div class="mb-12">
              <h2 class="text-4xl font-extrabold text-white mb-6 leading-tight tracking-tight">
                Jouw studententijd <br>
                begint <span class="text-accent">hier.</span>
              </h2>
              <p class="text-primary-100 text-lg max-w-sm leading-relaxed font-light">
                Log in om je favoriete koten op te slaan, en beheer als verhuurder makkelijk je panden en contracten.
              </p>
            </div>

            <div class="text-xs text-primary-300">
              © {{ currentYear }} KotCompass. All rights reserved.
            </div>
        </div>
      </div>

      <!-- Right Side: Login Form -->
      <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-white relative">
        
        <!-- Floating Home Button -->
        <div class="absolute top-8 right-8 z-20">
            <app-button-home></app-button-home>
        </div>

        <div class="w-full max-w-md space-y-8">
          
          <!-- Header (Mobile Logo visible here if needed, but keeping it clean) -->
          <div class="text-center lg:text-left">
            <h2 class="text-4xl font-extrabold text-primary-900 tracking-tight">Welkom terug</h2>
            <p class="mt-2 text-base text-gray-500">
              Nog geen account? 
              <a routerLink="/register" class="font-bold text-accent hover:text-accent-600 transition-colors underline decoration-2 decoration-transparent hover:decoration-accent">
                Maak er nu een aan
              </a>
            </p>
          </div>

          <!-- Error Alert -->
          @if (errorMessage) {
          <div class="rounded-lg bg-red-50 p-4 border-l-4 border-red-500 flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-red-600 shrink-0 mt-0.5">
               <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
          </div>
          }

          <form class="mt-8 space-y-6" (ngSubmit)="login()">
            <div class="space-y-5">
              
              <!-- Email Input -->
              <div class="relative group">
                <label for="email" class="block text-sm font-bold text-gray-700 mb-1 ml-1"
                  >Emailadres</label
                >
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                        </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      [(ngModel)]="email"
                      (blur)="checkEmail()"
                      (input)="emailCheck = ''"
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="voorbeeld@student.be"
                    />
                </div>
                @if (emailCheck) {
                <p class="text-red-500 text-xs mt-1 ml-1 font-medium">{{ emailCheck }}</p>
                }
              </div>

              <!-- Password Input -->
              <div class="relative group">
                <label for="password" class="block text-sm font-bold text-gray-700 mb-1 ml-1"
                  >Wachtwoord</label
                >
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                          <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      [(ngModel)]="password"
                      (blur)="checkPassword()"
                      (input)="passwordCheck = ''"
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="••••••••"
                    />
                </div>
                @if (passwordCheck) {
                <p class="text-red-500 text-xs mt-1 ml-1 font-medium">{{ passwordCheck }}</p>
                }
              </div>
            </div>

            <div>
              <button
                type="submit"
                [disabled]="!isValid()"
                class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-accent hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-accent-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              >
                Inloggen
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,

})
export class Login {
  constructor(
    private authService: AuthService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  currentYear = new Date().getFullYear();
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
        this.errorMessage = 'E-mailadres of wachtwoord is onjuist.';
        this.cdr.detectChanges();
      });
      console.error(error);
    }
  }
}
