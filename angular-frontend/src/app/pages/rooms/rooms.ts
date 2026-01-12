import { Component } from '@angular/core';
import { RoomListOverview } from '../../components/room-list-overview/room-list-overview';
import { KaartBuildings } from '../../components/kaart-buildings/kaart-buildings';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [RoomListOverview, KaartBuildings],
  template: `
    <div class="flex flex-col lg:flex-row h-screen">
      <!-- KAART (Links op desktop, boven op mobiel) -->
      <!-- sticky zorgt dat hij op scherm blijft bij scrollen op grote schermen -->
      <div class="w-full lg:w-1/2 h-[50vh] lg:h-screen lg:sticky lg:top-0 order-1 lg:order-2">
        <app-kaart-buildings></app-kaart-buildings>
      </div>

      <!-- LIJST (Rechts op desktop, onder op mobiel) -->
      <div class="w-full lg:w-1/2 p-4 overflow-y-auto order-2 lg:order-1 bg-gray-50">
        <h2 class="text-2xl font-bold mb-4 px-4 pt-4">Beschikbare Koten</h2>
        <app-room-list-overview></app-room-list-overview>
      </div>
    </div>
  `,
})
export class Rooms {}
