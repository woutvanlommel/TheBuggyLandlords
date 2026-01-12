import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseApi = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPublicRooms() {
    const token = sessionStorage.getItem('auth_token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any[]>(this.baseApi + 'public/rooms', { headers: headers });
  }

  // NIEUW: Haal rooms op binnen een bounding box
  getRoomsByBBox(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number
  ): Observable<any[]> {
    const params = new HttpParams()
      .set('minLat', minLat.toString())
      .set('maxLat', maxLat.toString())
      .set('minLng', minLng.toString())
      .set('maxLng', maxLng.toString());

    // Token mag mee, maar hoeft niet voor publieke route
    const token = sessionStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.get<any[]>(this.baseApi + 'public/rooms', { headers, params });
  }

  getRoomById(id: number) {
    return this.http.get<any>(`${this.baseApi}public/rooms/${id}`);
  }

  toggleFavorite(roomId: number) {
    const token = sessionStorage.getItem('auth_token');

    console.log('Sending Token:', token);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<{ is_favorited: boolean }>(
      'http://localhost:8000/api/favorites/toggle',
      { room_id: roomId },
      { headers: headers }
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
