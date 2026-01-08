import { Component, Input, OnInit, inject } from '@angular/core';
import { Room } from '../../models/room';
import { Document } from '../../models/document';
import { DocumentType } from '../../models/document-type';
import { RoomService } from '../../shared/room.service';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [],
  template: `
    <div class="rounded-xl shadow-md my-4 max-w-md bg-white w-full">
      <div class="flex flex-col gap-4 items-start">
        @if (imageDocs.length) {
        <img
          [src]="imageDocs[0].url"
          alt="Kamer afbeelding"
          class="w-full aspect-2/1 object-cover rounded-lg border border-gray-200"
        />
        } @else {
        <div
          class="w-full aspect-2/1 bg-gray-200 rounded-lg border border-gray-300 flex items-center justify-center text-gray-400 text-sm"
        >
          Geen afbeelding
        </div>
        }
        <div class="p-4">
          <h3 class="text-lg font-semibold">Kamer: {{ room?.roomnumber }}</h3>
          <small
            >{{ room?.building?.street?.street }} {{ room?.building?.housenumber }},
            {{ room?.building?.place?.zipcode }} {{ room?.building?.place?.place }}
          </small>
          <div class="font-bold text-green-700">Prijs: €{{ room?.price }}</div>
          <div>Gebouw: {{ room?.building?.housenumber }}</div>
          <div>Eigenaar: {{ room?.building?.owner?.fname }} {{ room?.building?.owner?.name }}</div>
        </div>
      </div>
      <!-- <div class="mt-2 text-sm text-gray-500">Afbeeldingen: {{ imageDocs.length }}</div> -->
    </div>
  `,
})
export class RoomCard {
  @Input() room?: Room;
  @Input() roomId?: number;
  private roomService = inject(RoomService);

  get imageDocs(): Document[] {
    return this.room?.images?.filter((doc: Document) => doc.document_type_id === 7) ?? [];
  }

  ngOnInit() {
    if (!this.room && this.roomId) {
      this.roomService.getRoomById(this.roomId).subscribe({
        next: (data) => {
          this.room = data;
        },
        error: (err) => {
          console.error('Fout bij ophalen kamer:', err);
        },
      });
    }
  }
}
