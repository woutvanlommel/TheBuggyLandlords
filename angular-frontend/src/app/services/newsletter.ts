import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  // Gebruik de volledige URL
  private apiUrl = 'http://127.0.0.1:8000/api/subscribe';

  constructor(private http: HttpClient) { }

  // Slechts één keer de functie definiëren
  subscribe(email: string): Observable<any> {
    console.log('Service roept Laravel aan voor:', email);
    return this.http.post(this.apiUrl, { email });
  }
}