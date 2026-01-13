import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomCardOverview } from '../room-card-overview/room-card-overview';

@Component({
  selector: 'app-room-list-overview',
  standalone: true,
  imports: [CommonModule, RoomCardOverview],
  template: `
    <div class="w-full max-w-300 mx-auto p-4">
      <!-- Loading State -->
      @if (rooms === null) {
      <div class="text-center text-gray-400 py-10">Laden...</div>
      }
      <!-- Empty State -->
      @else if (rooms.length === 0) {
      <div class="text-center text-gray-500 py-10">Geen kamers gevonden in dit gebied.</div>
      }
      <!-- List State -->
      @else {
      <div class="flex flex-col gap-4 w-full max-w-300 mx-auto">
        @for (room of rooms; track room.id) {
        <div class="w-full">
          <app-room-card-overview [room]="room"></app-room-card-overview>
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class RoomListOverview {
  // We accepteren data van de parent (Home of Rooms pagina)
  // Hierdoor is dit component herbruikbaar!
  @Input() rooms: any[] | null = null;
}
