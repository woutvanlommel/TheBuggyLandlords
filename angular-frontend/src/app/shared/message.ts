import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = environment.apiUrl + 'messages';

  constructor(private http: HttpClient) { }

  private getHeaders() {
    const token = sessionStorage.getItem('auth_token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getMyMessages() {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  sendMessage(data: any) {

    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  markAsRead(id: number) {
      return this.http.put(`${this.apiUrl}/${id}/read`, {}, { headers: this.getHeaders() });
  }
}
