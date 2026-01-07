import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApi = 'http://127.0.0.1:8000/api/'; // Let op: Laravel draait vaak op poort 8000
  private tokenKey = 'auth_token';

  // Helper om de token op te halen
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Helper om headers te maken MET token
  getAuthHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });

    const token = this.getToken();
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  async login(email: string, password: string): Promise<any> {
    const response = await fetch(this.baseApi + 'login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();

    // SLA DE TOKEN OP!
    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }

    return data;
  }

  async register(userData: any): Promise<any> {
    const response = await fetch(this.baseApi + 'register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    const data = await response.json();
    if (data.token) {
      localStorage.setItem(this.tokenKey, data.token);
    }
    return data;
  }

  async logout(): Promise<void> {
    // We proberen de logout call te doen, maar verwijderen lokaal sowieso de token
    try {
      await fetch(this.baseApi + 'logout', {
        method: 'POST',
        headers: this.getAuthHeaders(),
      });
    } catch (e) {
      console.error('Logout API call failed', e);
    } finally {
      localStorage.removeItem(this.tokenKey);
    }
  }

  async getUserProfile(): Promise<any> {
    const response = await fetch(this.baseApi + 'user', {
      method: 'GET',
      headers: this.getAuthHeaders(), // Gebruik de token header!
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }
    return response.json();
  }

  async updateUserProfile(profileData: any): Promise<any> {
    const response = await fetch(this.baseApi + 'profile', {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Failed to update user profile');
    }

    return response.json();
  }
}
