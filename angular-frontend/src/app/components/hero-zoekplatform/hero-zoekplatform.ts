import { Component } from '@angular/core';

@Component({
  selector: 'app-hero-zoekplatform',
  imports: [],
  standalone: true,
  template: `
    <section>
      <div>
        <div class="p-16 bg-black">
          <h1 class="text-4xl font-bold text-accent">Vind jouw ideale kot met KotCompass</h1>
          <h2>Zoek jouw kot</h2>
          <div>
            <input type="text" class="" />
            <input
              type="submit"
              value="Zoek kot"
              class="bg-primary text-white font-semibold rounded-md py-2 px-8 cursor-pointer hover:bg-primary-700 transition-colors duration-300"
            />
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroZoekplatform {}
