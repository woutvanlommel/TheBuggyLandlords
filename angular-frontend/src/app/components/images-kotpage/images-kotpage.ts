import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-images-kotpage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-7xl mx-auto px-4">
      <!-- Hoofdafbeelding: h-[500px] zorgt voor een mooie vaste hoogte op grotere schermen -->
      @if (mainImage) {
        <div
          class="w-full mb-6 relative group overflow-hidden rounded-xl shadow-lg h-[300px] md:h-[500px]"
        >
          <img
            [src]="mainImage"
            alt="Hoofdafbeelding kamer"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      }

      <!-- Galerij: grid-cols-1 voor mobiel, sm:grid-cols-2 voor tablet, md:grid-cols-4 voor desktop -->
      @if (galleryImages.length > 0) {
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          @for (img of galleryImages; track img.url) {
            <div
              class="relative aspect-square overflow-hidden rounded-2xl shadow-sm group cursor-pointer"
            >
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
})
export class ImagesKotpage implements OnChanges {
  @Input() images: any[] = [];

  // We slaan de gefilterde resultaten op in properties voor betere performance
  mainImage: string | undefined;
  galleryImages: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.updateImages();
    }
  }

  private updateImages(): void {
    if (!this.images) return;

    // ID 7: Kamerafbeelding (Hoofdfoto)
    this.mainImage = this.images.find((img) => img.document_type_id === 7)?.url;

    // ID 9: Kamergallerij
    this.galleryImages = this.images.filter((img) => img.document_type_id === 9);
  }
}
