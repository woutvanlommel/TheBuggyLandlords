import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RoomService } from '../../shared/room.service';
import { RoomCardOverview } from '../room-card-overview/room-card-overview';

// ...existing imports...
@Component({
  selector: 'app-room-list-overview',
  standalone: true,
  imports: [RoomCardOverview],
  template: `
    <div class="w-full max-w-300 mx-auto p-4">
      @if (!rooms()) {
      <div>Loading rooms...</div>
      } @else if (rooms()?.length === 0) {
      <div>Geen kamers gevonden.</div>
      } @else {
      <div class="flex flex-col gap-4 w-full max-w-300 mx-auto">
        @for (room of rooms(); track room.id) {
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
  private roomService = inject(RoomService);
  rooms = toSignal<any[]>(this.roomService.getPublicRooms());
}
