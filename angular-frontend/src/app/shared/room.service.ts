import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseApi = 'http://127.0.0.1:8000/api/';

  // Haal alle publieke kamers op (voor de map/lijst)
  async getPublicRooms(): Promise<any[]> {
    const response = await fetch(this.baseApi + 'public/rooms', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch rooms');
    }

    return response.json();
  }
}
