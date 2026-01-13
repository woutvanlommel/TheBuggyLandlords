import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseApi = environment.apiUrl;

  // 1. Voor de zoekpagina (Map updates)
  private mapRoomsSubject = new BehaviorSubject<any[]>([]);
  public mapRooms$ = this.mapRoomsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getPublicRooms(
    page: number = 1,
    limit: number = 9,
    highlighted: boolean = false
  ): Observable<any> {
    const token = sessionStorage.getItem('auth_token');

    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (highlighted) {
      params = params.set('highlighted', 'true');
    }

    return this.http.get<any>(this.baseApi + 'public/rooms', { headers: headers, params: params });
  }

  // Gebruikt door ZOEK pagina (Update de state voor de map)
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

    // ... headers logica ...
    const token = sessionStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.baseApi + 'public/rooms', { headers, params }).pipe(
      tap((response: any) => this.mapRoomsSubject.next(response.data)),
      map((response: any) => response.data) // <--- DEZE REGEL IS CRUCIAAL
    );
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
