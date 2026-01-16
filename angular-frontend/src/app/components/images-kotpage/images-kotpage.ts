// angular-frontend/src/app/components/images-kotpage/images-kotpage.ts

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common'; // Altijd handig voor pipes etc.

@Component({
  selector: 'app-images-kotpage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-7xl mx-auto px-4">
      @if (mainImage) {
      <div class="w-full mb-6 relative group overflow-hidden rounded-xl shadow-lg h-400">
        <img
          [src]="mainImage"
          alt="Hoofdafbeelding kamer"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      } @if (galleryImages.length > 0) {
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        @for (img of galleryImages; track img.url) {
        <div class="relative aspect-square overflow-hidden rounded-2xl shadow-sm group">
          <img
            [src]="img.url"
            alt="Galerij afbeelding"
            class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        }
      </div>
      }
    </div>
  `,
  styles: ``,
})
export class ImagesKotpage {
  @Input() images: any[] = [];

  get mainImage(): string | undefined {
    // Zoek specifiek naar ID 7 (Hoofdfoto)
    return this.images.find((img) => img.document_type_id === 7)?.url;
  }

  get galleryImages(): any[] {
    // Filter enkel op ID 9 (Galerij)
    return this.images.filter((img) => img.document_type_id === 9);
  }
}
