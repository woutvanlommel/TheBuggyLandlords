import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RoomList } from '../../components/room-list/room-list';
import { Navigation } from '../../components/navigation/navigation';
import { Footer } from '../../components/footer/footer';

@Component({
  selector: 'app-kotcompass',
  imports: [RoomList, Footer],
  styleUrl: './kotcompass.css',
  template: `
    <div class="min-h-screen flex flex-col">
      <div class="grow">
        <h1>Kotcompass Page</h1>
        <app-room-list></app-room-list>
      </div>
      <app-footer></app-footer>
    </div>
  `,
})
export class Kotcompass {}
