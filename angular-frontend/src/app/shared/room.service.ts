import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPublicRooms() {
    return this.http.get<any[]>(this.baseApi + 'public/rooms');
  }

  getRoomById(id: number) {
    return this.http.get<any>(`${this.baseApi}public/rooms/${id}`);
  }

  toggleFavorite(roomId: number) {
    return this.http.post<{ is_favorited: boolean }>(
      'http://localhost:8000/api/favorites/toggle',
      { room_id: roomId }
    );
  }

  // Haal alle publieke kamers op (voor de map/lijst)
  // async getPublicRooms(): Promise<any[]> {
  //   const response = await fetch(this.baseApi + 'public/rooms', {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Accept: 'application/json',
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error('Failed to fetch rooms');
  //   }

  //   return response.json();
  // }
}
