import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseApi = environment.apiUrl;

  // Haal alle publieke kamers op (voor de map/lijst)
  async getPublicRooms(): Promise<any[]> {
    const response = await fetch(this.baseApi + 'public/rooms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }

    return response.json();
  }
}
