import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApi = environment.apiUrl;
  private tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  // Helper om de token op te halen
  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // SLA DE TOKEN EN USER INFO OP IN SESSION STORAGE
    if (data.token) {
      sessionStorage.setItem(this.tokenKey, data.token);
    }
    if (data.user) {
      sessionStorage.setItem('user_fname', data.user.fname);
      sessionStorage.setItem('user_name', data.user.name);
      if (data.user.role) {
        sessionStorage.setItem('user_role', data.user.role.role);
      }
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

    const data = await response.json();

    if (!response.ok) {
      // Laravel validation errors often come in an 'errors' object or a 'message'
      const errorMsg = data.message || 'Registration failed';
      throw new Error(errorMsg);
    }

    if (data.token) {
      sessionStorage.setItem(this.tokenKey, data.token);
    }
    if (data.user) {
      sessionStorage.setItem('user_fname', data.user.fname);
      sessionStorage.setItem('user_name', data.user.name);
      if (data.user.role) {
        sessionStorage.setItem('user_role', data.user.role.role);
      }
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
      sessionStorage.clear();
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

  getProfile() {
    const token = sessionStorage.getItem(this.tokenKey);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    return this.http.get<any>(this.baseApi + 'user', { headers: headers});
    }
  }

