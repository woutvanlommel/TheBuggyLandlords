import { Component, inject, signal } from '@angular/core';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
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
      @if (isLoading()) {
      <div>Loading rooms...</div>
      } @else if (!rooms() || rooms()?.length === 0) {
      <div>Geen highlighted kamers gevonden.</div>
      } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-300 mx-auto">
        @for (room of rooms(); track room.id) {
        <div class="w-full">
          <app-room-card [room]="room"></app-room-card>
        </div>
        }
      </div>

      <!-- Pagination controls -->
      <div class="flex justify-center items-center gap-4 mt-8">
        <button
          (click)="prevPage()"
          [disabled]="currentPage() === 1"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Previous
        </button>

        <span class="font-bold"> Page {{ currentPage() }} of {{ lastPage() }} </span>

        <button
          (click)="nextPage()"
          [disabled]="currentPage() === lastPage()"
          class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      }
    </div>
  `,
})
export class RoomList {
  private roomService = inject(RoomService);

  //Status signals
  currentPage = signal(1);
  lastPage = signal(1);
  isLoading = signal(false);

  // Data stroom
  // 1. We luisteren naar veranderingen in currentPage
  // 2. We halen nieuwe data op (highlighted=true)
  private roomsResource = toObservable(this.currentPage).pipe(
    tap(() => this.isLoading.set(true)),
    switchMap((page) => this.roomService.getPublicRooms(page, 6, true)), // true = highlighted only
    tap((res) => {
      this.lastPage.set(res.last_page);
      this.isLoading.set(false);
    })
  );

  // 3. We zetten het om naar een signal voor de template
  // Laravel paginator stopt de items in property 'data'
  paginatedResult = toSignal(this.roomsResource);

  // Helper computed signal om direct toegang te hebben tot de lijst
  // Gebruikt protected field of getters in template
  get rooms() {
    return () => this.paginatedResult()?.data || [];
  }

  nextPage() {
    if (this.currentPage() < this.lastPage()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }
}
