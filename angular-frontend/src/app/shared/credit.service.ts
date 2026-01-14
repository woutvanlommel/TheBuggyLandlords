import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, map, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CreditPackage {
  id: number;
  credits: number;
  price: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CreditService {
  private apiUrl = environment.apiUrl + 'credits';
  
  private balanceSubject = new BehaviorSubject<number>(0); 
  public balance$ = this.balanceSubject.asObservable();

  // Hardcoded packages as requested
  private packages: CreditPackage[] = [
    { id: 1, name: 'Starter', credits: 50, price: 25 },
    { id: 2, name: 'Pro', credits: 100, price: 45 },
    { id: 3, name: 'Enterprise', credits: 500, price: 200 }
  ];

  constructor(private http: HttpClient) {
    this.refreshBalance();
  }

  refreshBalance() {
    this.http.get<{balance: number}>(`${this.apiUrl}/balance`)
      .pipe(map(res => res.balance))
      .subscribe({
        next: (val) => this.balanceSubject.next(val),
        error: (err) => console.error('Failed to fetch balance', err)
      });
  }

  getBalance(): Observable<number> {
    return this.balance$;
  }

  getPackages(): Observable<CreditPackage[]> {
    return of(this.packages);
  }

  buyPackage(packageId: number): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/buy`, { package_id: packageId }).pipe(
      tap(res => {
        if (res.success) {
          this.refreshBalance();
        }
      }),
      map(res => res.success)
    );
  }

  // LANDLORD FLOW
  toggleSpotlight(propertyId: number, isActive: boolean): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/spotlight`, { property_id: propertyId, active: isActive }).pipe(
      tap(res => {
         if (res.success) this.refreshBalance();
      }),
      map(res => res.success)
    );
  }

  // TENANT FLOW
  unlockChat(propertyId: number): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/unlock-chat`, { property_id: propertyId }).pipe(
      tap(res => {
        if (res.success) this.refreshBalance();
      }),
      map(res => res.success)
    );
  }
}
