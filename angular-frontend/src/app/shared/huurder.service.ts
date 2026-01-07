import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class HuurderService {
  private baseApi = 'http://127.0.0.1:8000/api/';

  constructor(private authService: AuthService) {}

  // Haalt de details op van de kamer die de user huurt
  async getMyRoom(): Promise<any> {
    const response = await fetch(this.baseApi + 'my-room', {
      method: 'GET',
      headers: this.authService.getAuthHeaders(),
    });

    if (!response.ok) {
      // 404 is geen error hier, maar gewoon 'geen kamer'
      if (response.status === 404) return null;
      throw new Error('Failed to fetch my room');
    }
    return response.json();
  }

  // Haalt contracten en andere documenten op
  async getMyDocuments(): Promise<any[]> {
    const response = await fetch(this.baseApi + 'my-documents', {
      method: 'GET',
      headers: this.authService.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  }

  // Download een document (Blob voor PDF's)
  async downloadDocument(id: number, fileName: string): Promise<void> {
    const response = await fetch(`${this.baseApi}documents/${id}/download`, {
      method: 'GET',
      headers: this.authService.getAuthHeaders(), // Authorization header is cruciaal!
    });

    if (!response.ok) {
      throw new Error('Download failed');
    }

    // Blob ophalen en download triggeren in browser
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  }

  // Dien een klacht in
  async submitComplaint(complaint: {
    name: string;
    description: string;
    complaint_type_id: number;
  }): Promise<any> {
    const response = await fetch(this.baseApi + 'complaints', {
      method: 'POST',
      headers: this.authService.getAuthHeaders(),
      body: JSON.stringify(complaint),
    });

    if (!response.ok) {
      throw new Error('Failed to submit complaint');
    }
    return response.json();
  }
}
