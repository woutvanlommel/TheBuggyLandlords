import { Component } from '@angular/core';
import { RoomList } from '../../components/room-list/room-list';

@Component({
  selector: 'app-kotcompass',
  imports: [RoomList],
  styleUrl: './kotcompass.css',
  template: `
    <h1>Kotcompass Page</h1>
    <app-room-list></app-room-list>
  `,
})
export class Kotcompass {}
