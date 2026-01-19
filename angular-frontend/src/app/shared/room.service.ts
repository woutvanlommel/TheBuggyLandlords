import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, Subject, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private baseApi = environment.apiUrl;
  private apiUrl = 'http://127.0.0.1:8000/api';

  // 1. Voor de zoekpagina (Map updates)
  private mapRoomsSubject = new BehaviorSubject<any[]>([]);
  public mapRooms$ = this.mapRoomsSubject.asObservable();

  // Filter state
  private currentFilters: any = {};
  public refreshTrigger$ = new Subject<void>();

  // Available Types (Dynamic)
  private availableTypesSubject = new BehaviorSubject<string[]>([]);
  public availableTypes$ = this.availableTypesSubject.asObservable();

  // Map Center control
  private mapCenterSubject = new BehaviorSubject<{ lat: number; lng: number; zoom: number } | null>(
    null,
  );
  public mapCenter$ = this.mapCenterSubject.asObservable();

  constructor(private http: HttpClient) {}

  updateFilters(filters: any) {
    this.currentFilters = { ...this.currentFilters, ...filters };
    this.refreshTrigger$.next();
  }

  setMapCenter(lat: number, lng: number, zoom: number = 13) {
    this.mapCenterSubject.next({ lat, lng, zoom });
  }

  getPublicRooms(
    page: number = 1,
    limit: number = 9,
    highlighted: boolean = false,
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

  searchCities(query: string): Observable<any[]> {
    let params = new HttpParams().set('query', query);
    return this.http.get<any[]>(this.baseApi + 'public/search-cities', { params });
  }

  // Gebruikt door ZOEK pagina (Update de state voor de map)
  getRoomsByBBox(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('minLat', minLat.toString())
      .set('maxLat', maxLat.toString())
      .set('minLng', minLng.toString())
      .set('maxLng', maxLng.toString());

    if (this.currentFilters.query) params = params.set('query', this.currentFilters.query);

    if (this.currentFilters.category) {
      let cat = this.currentFilters.category;
      // Support array -> comma string
      if (Array.isArray(cat)) {
        cat = cat.length > 0 ? cat.join(',') : 'All';
      }
      params = params.set('category', cat);
    }

    if (this.currentFilters.city) params = params.set('city', this.currentFilters.city);
    if (this.currentFilters.sort) params = params.set('sort', this.currentFilters.sort);

    // ... headers logica ...
    const token = sessionStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    if (token) headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(this.baseApi + 'public/rooms', { headers, params }).pipe(
      tap((response: any) => {
        this.mapRoomsSubject.next(response.data);
        // Update available types if present in response
        if (response.available_types) {
          this.availableTypesSubject.next(response.available_types);
        }
      }),
      map((response: any) => response.data), // <--- DEZE REGEL IS CRUCIAAL
    );
  }

  getRoomById(id: number) {
    const token = sessionStorage.getItem('auth_token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.get<any>(`${this.baseApi}public/rooms/${id}`, { headers });
  }

  getSearchSuggestions(query: string): Observable<string[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<string[]>(`${this.baseApi}public/search-suggestions`, { params });
  }

  getSearchLocation(query: string): Observable<any> {
    const params = new HttpParams().set('query', query);
    return this.http.get<any>(`${this.baseApi}public/search-location`, { params });
  }

  // In RoomService class...

  getFavorites() {
    const token = sessionStorage.getItem('auth_token');

    // Zorg voor de juiste headers (net als bij je andere calls)
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // 👇 CHECK DEZE URL: Komt hij overeen met je backend route?
    // Het kan zijn: '/favorites', '/user/favorites' of '/buildings/favorites'
    return this.http.get<any[]>(`${this.apiUrl}/favorites`, { headers });
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
      { headers: headers },
    );
  }

  private facilitiesCache$?: Observable<any[]>;

  getFacilities(): Observable<any[]> {
    if (!this.facilitiesCache$) {
      this.facilitiesCache$ = this.http.get<any[]>(`${this.baseApi}public/facilities`).pipe(
        shareReplay(1)
      );
    }
    return this.facilitiesCache$;
  }
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
