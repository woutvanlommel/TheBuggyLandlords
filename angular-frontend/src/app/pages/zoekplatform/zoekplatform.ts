import { RoomList } from './../../components/room-list/room-list';
import { Room } from './../../models/room';
import { Component } from '@angular/core';
import { HeroZoekplatform } from '../../components/hero-zoekplatform/hero-zoekplatform';
import { AppCityTiles } from '../../components/app-city-tiles/app-city-tiles';

@Component({
  selector: 'app-zoekplatform',
  imports: [RoomList, HeroZoekplatform, AppCityTiles],
  template: ` 
    <app-hero-zoekplatform></app-hero-zoekplatform>
    
    <div class="container mx-auto px-4 -mt-16 relative z-10 mb-12">
        <app-app-city-tiles></app-app-city-tiles>
    </div>

    <app-room-list></app-room-list>`,
})
export class Zoekplatform {}
