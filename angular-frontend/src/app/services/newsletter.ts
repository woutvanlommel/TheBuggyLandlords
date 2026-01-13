import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import emailjs from '@emailjs/browser';
import { AuthService } from '../shared/auth.service';

@Injectable({
  providedIn: 'root'
})
export class NewsletterService {
  private apiUrl = 'http://127.0.0.1:8000/api/subscribe';

  constructor(private http: HttpClient, private auth: AuthService) {
    emailjs.init('CFoeX1pb8DFWpKKYO');
  }

  subscribe(email: string): Observable<any> {
    console.log('Newsletter subscription:', email);

    // 1. Save to Database (Laravel)
    const token = this.auth.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    const dbRequest = this.http.post(this.apiUrl, { email }, { headers });

    // 2. Send Email (EmailJS)
    const serviceID = 'service_4d8uh4f';
    const templateID = 'template_a4xdazo';
    const templateParams = {
      email: email,
      reply_to: email,
      message: 'New newsletter subscription'
    };

    return dbRequest.pipe(
      tap(() => console.log('Saved to DB')),
      switchMap((response: any) => {
        if (response.was_recently_created) {
          console.log('New subscriber, sending email via EmailJS...');
          return from(emailjs.send(serviceID, templateID, templateParams));
        } else {
          console.log('Subscriber already exists, skipping email.');
          return of({ text: 'Already subscribed, email skipped' });
        }
      })
    );
  }
}
