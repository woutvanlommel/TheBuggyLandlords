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
      <h2 class="text-5xl text-accent-500 font-bold" id="topList">Room List</h2>
      @if (isLoading()) {
      <div>Loading rooms...</div>
      } @else if (!rooms() || rooms()?.length === 0) {
      <div>Geen highlighted kamers gevonden.</div>
      } @else {
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-300 mx-auto py-4"
      >
        @for (room of rooms(); track room.id) {
        <div class="w-full">
          <app-room-card [room]="room"></app-room-card>
        </div>
        }
      </div>

      <!-- Pagination controls -->
      <div class="flex flex-wrap justify-center items-center gap-2 mt-8 select-none">
        <button
          (click)="prevPage()"
          [disabled]="currentPage() === 1"
          class="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600"
          title="Vorige pagina"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        @for (page of visiblePages(); track $index) { @if (page === -1) {
        <span class="px-2 text-gray-400 font-bold">...</span>
        } @else {
        <button
          (click)="goToPage(page)"
          class="h-10 min-w-40px px-2 flex items-center justify-center rounded-lg text-sm font-bold transition-all border"
          [class.bg-accent-500]="currentPage() === page"
          [class.text-white]="currentPage() === page"
          [class.border-accent-500]="currentPage() === page"
          [class.bg-white]="currentPage() !== page"
          [class.text-gray-700]="currentPage() !== page"
          [class.border-gray-200]="currentPage() !== page"
          [class.hover:bg-gray-50]="currentPage() !== page"
        >
          {{ page }}
        </button>
        } }

        <button
          (click)="nextPage()"
          [disabled]="currentPage() === lastPage()"
          class="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-gray-600"
          title="Volgende pagina"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-5 h-5"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
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
      this.scrollToTopList();
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
      this.scrollToTopList();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.lastPage()) {
      this.currentPage.set(page);
      this.scrollToTopList();
    }
  }

  private scrollToTopList() {
    const element = document.getElementById('topList');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  visiblePages() {
    const current = this.currentPage();
    const last = this.lastPage();
    const delta = 2;
    const range: number[] = [];

    for (let i = Math.max(2, current - delta); i <= Math.min(last - 1, current + delta); i++) {
      range.push(i);
    }

    if (current - delta > 2) {
      range.unshift(-1);
    }
    if (current + delta < last - 1) {
      range.push(-1);
    }

    range.unshift(1);
    if (last > 1) {
      range.push(last);
    }

    return range;
  }
}
