import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  // Use full API URL
  private apiUrl = 'http://127.0.0.1:8000/api/subscribe';

  constructor(private http: HttpClient, private auth: AuthService) { }

  // Define subscribe once
  subscribe(email: string): Observable<any> {
    console.log('Service roept Laravel aan voor:', email);

    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return this.http.post(this.apiUrl, { email }, { headers });
  }
}