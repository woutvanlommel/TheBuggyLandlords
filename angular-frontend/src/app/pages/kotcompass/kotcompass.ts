import { Component } from '@angular/core';
import { RouterModule } from "@angular/router";



@Component({
  selector: 'app-kotcompass',
  imports: [RouterModule],
  styleUrl: './kotcompass.css',
  template: `
    <h1>Kotcompass Page</h1>
    <router-outlet></router-outlet>
  `,
})
export class Kotcompass {}
