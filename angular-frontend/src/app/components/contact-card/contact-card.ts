import { Component } from '@angular/core';
import { NgClass, NgIf } from "@angular/common";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contact-card',
  imports: [NgClass, NgIf],
  template: `
  <div class="card" [ngClass]="{'spotlight-active': contactData.isSpotLighted}" class="contactDetails">
    <img [src]="contactData.avatarUrl" alt="profilePicture">
    <h3>{{ contactData.name }}</h3>
    <div *ngIf="contactData.isCreditInUse || contactData.isSpotLighted">
      <p>{{ contactData.email }}</p>
      <p>{{ contactData.telephone }}</p>
    </div>

    <div *ngIf="!contactData.isCreditInUse && !contactData.isSpotLighted" class="locked-info">
      <p>Use credits to see contact details</p>
    </div>
  </div>`,
  styles: ``,
})
export class ContactCard {
  name: string = 'Contact Card Component';
  email: string = '';
  telephone: string = '';
  isCreditInUse: boolean = false;
  isSpotLighted: boolean = false;
  avatarUrl?: string = '';

  contactData: any;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchContactData();
  }
  fetchContactData() {
    this.http.get('//verbinden on next commit').subscribe({
      next: (data) => {
        this.contactData = data;
      },
      error: (error) => {
        console.error('Error fetching contact data:', error);
      },
    });
  }

}