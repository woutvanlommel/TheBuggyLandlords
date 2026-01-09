import { Component, inject } from '@angular/core';
import { RoomService } from '../../shared/room.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (room && room?.id) {
    <div class="bg-base-een rounded-lg p-4 mx-auto w-fit my-4">
      <h2>Kot detail</h2>
      <p>{{ room?.building?.place?.zipcode }} {{ room?.building?.place?.place }}</p>
      <p>Kot ID: {{ room.id }}</p>
      <p>Prijs: €{{ room.price }}</p>
    </div>
    <!-- Voeg hier meer kamerinfo toe -->
    } @else {
    <div #loading>
      <p>Laden...</p>
    </div>
    }
  `,
})
export class RoomDetail {
  private route = inject(ActivatedRoute);
  private roomService = inject(RoomService);
  room: any = null;

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.roomService.getRoomById(id).subscribe({
        next: (data) => {
          console.log('Kamerdata:', data);
          this.room = data;
        },
        error: (err) => {
          console.error('Fout bij ophalen kamer:', err);
          this.room = null;
        },
      });
    }
  }
}
