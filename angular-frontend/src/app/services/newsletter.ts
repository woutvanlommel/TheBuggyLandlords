import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  // Dit is de URL naar je Laravel API (zorg dat Laravel draait!)
  private apiUrl = 'http://127.0.0.1:8000/api/subscribe';

  constructor(private http: HttpClient) { }

  subscribe(email: string): Observable<any> {
    // We sturen alleen het emailadres door
    return this.http.post(this.apiUrl, { email });
  }
}