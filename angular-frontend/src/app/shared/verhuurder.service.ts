import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class VerhuurderService {
  private baseApi = environment.apiUrl;

  constructor(private authService: AuthService) {}

  // Haal alle gebouwen (en hun kamers) op van de verhuurder
  async getMyBuildings(): Promise<any[]> {
    const response = await fetch(this.baseApi + 'my-buildings', {
      method: 'GET',
      headers: this.authService.getAuthHeaders(), // Met token!
    });

    if (!response.ok) {
      throw new Error('Failed to fetch buildings');
    }
    return response.json();
  }

  // Voeg een nieuw gebouw toe
  async addBuilding(buildingData: any): Promise<any> {
    const headers = this.authService.getAuthHeaders();
    
    // De headers is een Headers object, dus we moeten append/set gebruiken als we iets willen toevoegen
    // AuthService voegt al correcte auth en content-type headers toe.

    const response = await fetch(this.baseApi + 'add-building', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(buildingData),
    });

    if (!response.ok) {
      // Probeer de JSON error te lezen
      const errorData = await response.json().catch(() => ({}));
      console.error('Add Building failed:', errorData);
      throw new Error(errorData.message || 'Failed to add building');
    }
    return response.json();
  }
}
