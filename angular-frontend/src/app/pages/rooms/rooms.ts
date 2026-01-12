import { Component } from '@angular/core';
import { RoomListOverview } from '../../components/room-list-overview/room-list-overview';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [RoomListOverview],
  template: ` <app-room-list-overview></app-room-list-overview>`,
})
export class Rooms {}
