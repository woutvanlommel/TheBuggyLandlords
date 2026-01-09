import { Component, Input, OnInit, inject } from '@angular/core';
import { Room } from '../../models/room';
import { Document } from '../../models/document';
import { DocumentType } from '../../models/document-type';
import { RoomService } from '../../shared/room.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-room-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="rounded-xl shadow-md my-4 max-w-md bg-white w-full">
      <div class="flex flex-col gap-4 items-start">
        @if (imageDocs.length) {
        <img
          [src]="imageDocs[0].url"
          alt="Kamer afbeelding"
          class="w-full aspect-2/1 object-cover rounded-t-lg border border-gray-200"
        />
        } @else {
        <div
          class="w-full aspect-2/1 bg-gray-200 rounded-t-lg border border-gray-300 flex items-center justify-center text-gray-400 text-sm"
        >
          Geen afbeelding
        </div>
        }
        <div class="p-4 w-full flex flex-col justify-between items-center gap-4">
          <div class="w-full">
            <h3 class="text-lg font-semibold">
              {{ room?.roomtype }} - {{ room?.building?.place?.place }}
              {{ room?.building?.place?.zipcode }}
            </h3>

            <div>
              Eigenaar: {{ room?.building?.owner?.fname }} {{ room?.building?.owner?.name }}
            </div>
            <small
              >{{ room?.building?.street?.street }} {{ room?.building?.housenumber }},
              {{ room?.building?.place?.zipcode }} {{ room?.building?.place?.place }}
            </small>
          </div>
          <div class="flex justify-between items-center w-full">
            <a
              [routerLink]="['/kotcompass/rooms', room?.id]"
              class="py-1 px-4 rounded-md bg-accent text-white text-sm w-fit"
              >Bekijk kot</a
            >
            <div class="font-bold text-green-700 text-end w-fit">Prijs: €{{ room?.price }}</div>
          </div>
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
