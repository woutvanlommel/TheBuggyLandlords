import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Navigation } from '../../components/navigation/navigation';

@Component({
  selector: 'app-kotcompass',
  imports: [RouterModule, Navigation],
  styleUrl: './kotcompass.css',
  template: `
    <app-navigation></app-navigation>
    <h1>Kotcompass Page</h1>
    <router-outlet></router-outlet>
  `,
})
export class Kotcompass {}
