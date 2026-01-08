import { RoomList } from './../../components/room-list/room-list';
import { Room } from './../../models/room';
import { Component } from '@angular/core';

@Component({
  selector: 'app-zoekplatform',
  imports: [RoomList],
  template: `<app-room-list></app-room-list>`,
})
export class Zoekplatform {

}
