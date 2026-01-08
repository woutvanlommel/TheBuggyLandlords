import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-zoekplatform',
  imports: [],
  standalone: true,
  styles: [
    `
      .bg-hero {
        background-image: url('/assets/img/hero-bg.jpg');
        background-size: cover;
        background-position: center;
        width: 100%;
      }
    `,
  ],
  template: `
    <section>
      <div class="w-full bg-hero">
        <div class="bg-black/30 flex items-center justify-center pt-64 pb-32">
          <div
            class="p-16 bg-linear-to-t from-white/60 to-white/10 flex flex-col gap-8 items-center rounded-lg shadow-lg"
          >
            <h1 class="text-4xl font-bold text-accent">Vind jouw ideale kot met KotCompass</h1>
            <h2 class="text-5xl font-semibold text-primary">Zoek jouw kot</h2>
            <form class="flex flex-col sm:flex-row items-stretch gap-2 w-full max-w-xl mt-2">
              <input
                type="text"
                placeholder="Typ een stad, straat of kotnaam..."
                class="flex-1 rounded-l-md rounded-r-md sm:rounded-r-none bg-white/80 border border-primary/30 px-5 py-3 text-lg shadow focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all duration-200"
              />
              <button
                type="submit"
                class="bg-primary text-white font-semibold rounded-md sm:rounded-l-none sm:rounded-r-md py-3 px-8 cursor-pointer hover:bg-primary-700 transition-colors duration-300 shadow"
              >
                Zoek kot
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroZoekplatform {}
