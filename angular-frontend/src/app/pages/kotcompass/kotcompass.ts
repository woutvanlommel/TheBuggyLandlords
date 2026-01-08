import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../../components/navigation/navigation';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-kotcompass',
  imports: [Footer, Navigation, RouterModule],
  styleUrl: './kotcompass.css',
  template: `
    <app-navigation></app-navigation>
    <div class="min-h-screen flex flex-col">
      <div class="grow">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `,
})
export class Kotcompass {}
