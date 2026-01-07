import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class VerhuurderService {
  private baseApi = 'http://127.0.0.1:8000/api/';

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
}
