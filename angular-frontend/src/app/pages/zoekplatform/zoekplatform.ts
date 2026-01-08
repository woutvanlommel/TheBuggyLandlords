import { RoomList } from './../../components/room-list/room-list';
import { Room } from './../../models/room';
import { Component } from '@angular/core';
import { HeroZoekplatform } from '../../components/hero-zoekplatform/hero-zoekplatform';

@Component({
  selector: 'app-zoekplatform',
  imports: [RoomList, HeroZoekplatform],
  template: ` <app-hero-zoekplatform></app-hero-zoekplatform>
    <app-room-list></app-room-list>`,
})
export class Zoekplatform {}
