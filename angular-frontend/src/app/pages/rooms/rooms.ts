import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomListOverview } from '../../components/room-list-overview/room-list-overview';
import { KaartBuildings } from '../../components/kaart-buildings/kaart-buildings';
import { RoomService } from '../../shared/room.service';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RoomListOverview, KaartBuildings],
  template: `
    <!-- 
      MAIN CONTAINER: 
      We gebruiken 'h-[calc(100dvh-64px)]'.
      1. '100dvh' = Dynamic Viewport Height (past zich aan als adresbalk verdwijnt op mobiel).
      2. '-64px' = We trekken de hoogte van je Navbar eraf (pas dit aan als je navbar hoger/lager is).
    -->
    <div class="flex flex-col lg:flex-row h-[calc(100dvh-100px)] w-full overflow-hidden">
      <!-- 1. KAART COMPONENT -->
      <!-- Desktop: h-full (vult de ruimte rechts) -->
      <!-- Mobile: h-[40dvh] (iets kleiner dan 50%, zodat je lijst al ziet) -->
      <div class="w-full lg:w-1/2 h-[45dvh] lg:h-full order-1 lg:order-2 z-10 relative">
        <app-kaart-buildings></app-kaart-buildings>
      </div>

      <!-- 2. LIJST COMPONENT -->
      <!-- Desktop: h-full, scrollt onafhankelijk -->
      <!-- Mobile: Neemt resterende ruimte in (flex-1) en scrollt -->
      <div
        class="w-full lg:w-1/2 flex-1 lg:h-full overflow-y-auto p-4 bg-gray-50 order-2 lg:order-1"
      >
        <h2 class="text-2xl font-bold mb-4 px-4 pt-4 text-gray-800">Resultaten op kaart</h2>

        <app-room-list-overview [rooms]="roomService.mapRooms$ | async"></app-room-list-overview>
      </div>
    </div>
  `,
})
export class Rooms {
  constructor(public roomService: RoomService) {}
}
