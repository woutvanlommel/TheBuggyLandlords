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
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
})
export class Kotcompass {}
