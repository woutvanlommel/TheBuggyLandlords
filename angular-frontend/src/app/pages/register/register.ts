import { Component, NgZone } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonHome } from '../../components/app-city-tiles/button-home/button-home';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterModule, ButtonHome],
  template: `
    <div class="min-h-screen flex w-full bg-white font-sans">
      
      <!-- Left Side: Image & Branding (Desktop Only) -->
      <div class="hidden lg:flex w-1/2 bg-primary-900 overflow-hidden sticky top-0 h-screen">
        <!-- Background Image -->
        <div 
          class="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style="background-image: url('/assets/img/hero-bg.jpg');"
        ></div>
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-linear-to-t from-primary-900 via-primary-900/40 to-transparent"></div>

        <!-- Content -->
        <div class="relative z-10 w-full flex flex-col justify-between p-12 h-full">
            <div>
              <img src="/assets/logo/400pxX100pxLogoLiggendVolledigOranje.png" alt="KotCompass" class="h-16 w-auto mb-6">
            </div>
            
            <div class="mb-12">
              <h2 class="text-4xl font-bold text-white mb-4 leading-tight">
                Begin vandaag nog <br>
                met jouw <span class="text-accent">nieuwe avontuur.</span>
              </h2>
              <p class="text-primary-100 text-lg max-w-md">
                Of je nu een kot zoekt of er een verhuurt, bij ons ben je aan het juiste adres.
                Maak een account aan en ontdek de mogelijkheden.
              </p>
            </div>

            <div class="text-xs text-primary-300">
              © {{ currentYear }} KotCompass. All rights reserved.
            </div>
        </div>
      </div>

      <!-- Right Side: Register Form -->
      <div class="w-full lg:w-1/2 flex flex-col items-center p-8 bg-white relative min-h-screen overflow-y-auto">
        
        <!-- Floating Home Button -->
        <div class="absolute top-8 right-8 z-20">
            <app-button-home></app-button-home>
        </div>

        <div class="w-full max-w-md space-y-8 mt-12 lg:mt-0">
          
          <div class="text-center lg:text-left">
            <h2 class="text-4xl font-extrabold text-primary-900 tracking-tight">Account aanmaken</h2>
            <p class="mt-2 text-base text-gray-500">
              Heb je al een account? 
              <a routerLink="/login" class="font-bold text-accent hover:text-accent-600 transition-colors underline decoration-2 decoration-transparent hover:decoration-accent">
                Log hier in
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

          <form class="mt-8 space-y-6" (ngSubmit)="register()">
            
            <!-- Role Selection (Cards) -->
            <div class="grid grid-cols-2 gap-4">
               <label class="cursor-pointer">
                  <input type="radio" name="role" [value]="1" [(ngModel)]="role" class="peer sr-only">
                  <div class="rounded-xl border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-accent peer-checked:bg-accent-50 peer-checked:text-accent-900 hover:border-accent-200 hover:shadow-md">
                    <div class="font-bold text-lg mb-1">Huurder</div>
                    <div class="text-xs text-gray-500 peer-checked:text-accent-700">Ik zoek een kot</div>
                  </div>
               </label>
               <label class="cursor-pointer">
                  <input type="radio" name="role" [value]="2" [(ngModel)]="role" class="peer sr-only">
                  <div class="rounded-xl border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-accent peer-checked:bg-accent-50 peer-checked:text-accent-900 hover:border-accent-200 hover:shadow-md">
                    <div class="font-bold text-lg mb-1">Verhuurder</div>
                    <div class="text-xs text-gray-500 peer-checked:text-accent-700">Ik verhuur een kot</div>
                  </div>
               </label>
            </div>

            <div class="space-y-5">
              
              <!-- Name Fields -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <!-- First Name -->
                <div class="relative group">
                    <label for="fname" class="block text-sm font-bold text-gray-700 mb-1 ml-1">Voornaam</label>
                    <input
                      type="text"
                      id="fname"
                      name="fname"
                      [(ngModel)]="fname"
                      required
                      class="block w-full px-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="Jan"
                    />
                </div>
                 <!-- Last Name -->
                <div class="relative group">
                    <label for="name" class="block text-sm font-bold text-gray-700 mb-1 ml-1">Achternaam</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      [(ngModel)]="name"
                      required
                      class="block w-full px-4 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="Janssens"
                    />
                </div>
              </div>

              <!-- Contact Fields -->
              <div class="relative group">
                <label for="email" class="block text-sm font-bold text-gray-700 mb-1 ml-1">Emailadres</label>
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
                      required
                      class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="jan.janssens@student.be"
                    />
                </div>
              </div>

              <div class="relative group">
                <label for="phone" class="block text-sm font-bold text-gray-700 mb-1 ml-1">Telefoonnummer</label>
                <div class="relative">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                          <path fill-rule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      [(ngModel)]="phone"
                      required
                       class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="+32 4XX XX XX XX"
                    />
                </div>
              </div>

               <!-- Password Fields -->
              <div class="relative group">
                <label for="password" class="block text-sm font-bold text-gray-700 mb-1 ml-1">Wachtwoord</label>
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
                      required
                      minlength="8"
                       class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="Minimaal 8 tekens"
                    />
                </div>
              </div>

              <div class="relative group">
                <label for="password_confirmation" class="block text-sm font-bold text-gray-700 mb-1 ml-1">Bevestig Wachtwoord</label>
                <div class="relative">
                     <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-accent transition-colors">
                         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                             <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input
                      type="password"
                      id="password_confirmation"
                      name="password_confirmation"
                      [(ngModel)]="password_confirmation"
                      required
                       class="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all shadow-sm sm:text-sm"
                      placeholder="Herhaal wachtwoord"
                    />
                </div>
                <!-- Inline Error -->
                 @if (password !== password_confirmation && password_confirmation) {
                  <p class="text-red-500 text-xs mt-1 ml-1 font-medium flex items-center gap-1">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                    </svg>
                    Wachtwoorden komen niet overeen
                  </p>
                 }
              </div>

            </div>

            <div class="pt-2">
              <button
                type="submit"
                [disabled]="!isValid()"
                class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-full text-white bg-accent hover:bg-accent-600 focus:outline-none focus:ring-4 focus:ring-accent-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95"
              >
                Account Aanmaken
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class Register {
  constructor(private authService: AuthService, private router: Router, private ngZone: NgZone) {}

  currentYear = new Date().getFullYear();
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
