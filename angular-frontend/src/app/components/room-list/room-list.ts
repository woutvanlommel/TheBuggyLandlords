import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RoomService } from '../../shared/room.service';
import { RoomCard } from '../room-card/room-card';

// ...existing imports...
@Component({
  selector: 'app-room-list',
  standalone: true,
  imports: [RoomCard],
  template: `
    <div class="w-full max-w-300 mx-auto p-4">
      <h2 class="text-5xl text-accent-500 font-bold">Room List</h2>
      @if (!rooms()) {
      <div>Loading rooms...</div>
      } @else if (rooms()?.length === 0) {
      <div>Geen kamers gevonden.</div>
      } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-300 mx-auto">
        @for (room of rooms(); track room.id) {
        <div class="w-full">
          <app-room-card [room]="room"></app-room-card>
        </div>
        }
      </div>
      }
    </div>
  `,
})
export class RoomList {
  private roomService = inject(RoomService);
  rooms = toSignal<any[]>(this.roomService.getPublicRooms());
}
