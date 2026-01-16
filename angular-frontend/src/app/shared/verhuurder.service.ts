import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerhuurderService {
  private baseApi = environment.apiUrl;
  private roomTypesCache: any[] | null = null;

  constructor(private authService: AuthService, private http: HttpClient) {}

  // Haal alle gebouwen (en hun kamers) op van de verhuurder
  async getMyBuildings(): Promise<any[]> {
    // Convert Headers object to plain object for HttpClient
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any[]>(this.baseApi + 'my-buildings', { headers: headersObj })
    );
  }

  // Zoek suggesties voor een adres
  async suggestAddress(query: string): Promise<any[]> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any[]>(`${this.baseApi}suggest-address?q=${query}`, { headers: headersObj })
    );
  }

  // Haal één specifiek gebouw op
  async getBuilding(id: number): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any>(`${this.baseApi}buildings/${id}`, { headers: headersObj })
    );
  }

  // Voeg een nieuw gebouw toe
  async addBuilding(buildingData: any): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.post(this.baseApi + 'add-building', buildingData, { headers: headersObj })
    );
  }

  // Update een bestaand gebouw
  async updateBuilding(id: number, buildingData: any): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.put(`${this.baseApi}buildings/${id}`, buildingData, { headers: headersObj })
    );
  }

  // Verwijder een gebouw
  async deleteBuilding(id: number): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.delete(`${this.baseApi}buildings/${id}`, { headers: headersObj })
    );
  }

  // Haal een specifieke kamer op voor bewerking
  async getRoom(id: number): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any>(`${this.baseApi}rooms/${id}`, { headers: headersObj })
    );
  }

  // Voeg een kamer toe aan een gebouw
  async addRoom(roomData: any): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.post(this.baseApi + 'rooms', roomData, { headers: headersObj })
    );
  }

  // Update een kamer
  async updateRoom(id: number, roomData: any): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.put(`${this.baseApi}rooms/${id}`, roomData, { headers: headersObj })
    );
  }

  // Verwijder een kamer
  async deleteRoom(id: number): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(this.http.delete(`${this.baseApi}rooms/${id}`, { headers: headersObj }));
  }

  // Haal kamertypes op
  async getRoomTypes(): Promise<any[]> {
    if (this.roomTypesCache) return this.roomTypesCache;

    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    const types = await firstValueFrom(
      this.http.get<any[]>(this.baseApi + 'room-types', { headers: headersObj })
    );
    this.roomTypesCache = types;
    return types;
  }

  async getExtraCosts(): Promise<any[]> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any[]>(this.baseApi + 'extra-costs', { headers: headersObj })
    );
  }

  async getFacilities(): Promise<any[]> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any[]>(this.baseApi + 'facilities', { headers: headersObj })
    );
  }

  // Zoek huurders
  async searchUsers(query: string): Promise<any[]> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.get<any[]>(`${this.baseApi}search-users?q=${query}`, { headers: headersObj })
    );
  }

  // Koppel huurder
  async linkTenant(
    roomId: number,
    userId: number,
    startDate: string,
    endDate?: string
  ): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.post(
        `${this.baseApi}rooms/link-tenant`,
        { room_id: roomId, user_id: userId, start_date: startDate, end_date: endDate },
        { headers: headersObj }
      )
    );
  }

  // Ontkoppel huurder
  async unlinkTenant(roomId: number): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.post(`${this.baseApi}rooms/${roomId}/unlink-tenant`, {}, { headers: headersObj })
    );
  }

  // Upload een afbeelding voor een kamer
  async uploadRoomImage(roomId: number, file: File, typeId: number): Promise<any> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('room_id', roomId.toString());
    formData.append('document_type_id', typeId.toString());

    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      if (key.toLowerCase() !== 'content-type') {
        headersObj[key] = value;
      }
    });

    return firstValueFrom(
      this.http.post(`${this.baseApi}rooms/upload-image`, formData, { headers: headersObj })
    );
  }

  // Verwijder een afbeelding
  async deleteImage(documentId: number): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
      headersObj[key] = value;
    });

    return firstValueFrom(
      this.http.delete(`${this.baseApi}documents/${documentId}`, { headers: headersObj })
    );
  }
}
