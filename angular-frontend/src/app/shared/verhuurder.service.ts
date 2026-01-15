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

  constructor(private authService: AuthService, private http: HttpClient) {}

  // Haal alle gebouwen (en hun kamers) op van de verhuurder
  async getMyBuildings(): Promise<any[]> {
    // Convert Headers object to plain object for HttpClient
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
        headersObj[key] = value;
    });

    return firstValueFrom(this.http.get<any[]>(this.baseApi + 'my-buildings', { headers: headersObj }));
  }

  // Voeg een nieuw gebouw toe
  async addBuilding(buildingData: any): Promise<any> {
    const headersObj: { [header: string]: string } = {};
    this.authService.getAuthHeaders().forEach((value, key) => {
        headersObj[key] = value;
    });

    return firstValueFrom(this.http.post(this.baseApi + 'add-building', buildingData, { headers: headersObj }));
  }
}
