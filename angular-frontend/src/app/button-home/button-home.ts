import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button-home',
  imports: [RouterLink],
  standalone: true,
  template: `
    <button
      routerLink="/"
      class="py-2 px-4 bg-accent text-white font-semibold rounded-lg shadow-md cursor-pointer hover:bg-accent-dark transition-colors duration-300"
    >
      Home
    </button>
  `,
})
export class ButtonHome {}
