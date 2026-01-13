import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomListOverview } from '../../components/room-list-overview/room-list-overview';
import { KaartBuildings } from '../../components/kaart-buildings/kaart-buildings';
import { RoomService } from '../../shared/room.service';
import { SearchFilter } from '../../components/search-filter/search-filter';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, RoomListOverview, KaartBuildings, SearchFilter],
  template: `
    <div class="flex flex-col w-full h-[calc(100dvh-64px)] overflow-hidden">
      
      <!-- 1. FULL WIDTH FILTER BAR (Fixed Top) -->
      <div class="z-20 relative bg-white">
        <app-search-filter></app-search-filter>
      </div>

      <!-- 2. MAIN CONTENT (Map + List) -->
      <div class="flex flex-col lg:flex-row flex-1 overflow-hidden relative z-10">
        
        <!-- KAART (Right on Desktop, Top on Mobile) -->
        <div class="w-full lg:w-1/2 h-[40dvh] lg:h-full order-1 lg:order-2 relative border-l border-gray-200">
          <app-kaart-buildings></app-kaart-buildings>
        </div>

        <!-- LIJST (Left on Desktop, Bottom on Mobile) -->
        <div class="w-full lg:w-1/2 flex-1 lg:h-full overflow-y-auto bg-gray-50 order-2 lg:order-1">
          <div class="p-4 lg:p-6">
            <h2 class="text-xl lg:text-2xl font-bold mb-4 text-gray-800">Resultaten op kaart</h2>
            <app-room-list-overview [rooms]="roomService.mapRooms$ | async"></app-room-list-overview>
          </div>
        </div>

      </div>
    </div>
  `,
})
export class Rooms {
  constructor(public roomService: RoomService) {}
}
