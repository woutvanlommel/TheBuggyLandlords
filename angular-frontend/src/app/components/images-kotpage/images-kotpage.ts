import { Component, Input, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-images-kotpage',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full mx-auto">
      <!-- Hoofdafbeelding -->
      @if (mainImage) {
        <div
          (click)="openModal(0)"
          class="w-full mb-4 relative group overflow-hidden rounded-xl shadow-lg h-[300px] md:h-[500px] cursor-pointer"
        >
          <img
            [src]="mainImage"
            alt="Hoofdafbeelding kamer"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      }

      <!-- Galerij (max 4 getoond) -->
      @if (galleryImages.length > 0) {
        <div class="grid grid-cols-4 gap-4">
          @for (img of galleryImages.slice(0, 4); track img.url; let i = $index) {
            <div
              (click)="openModal(i + 1)"
              class="relative aspect-square overflow-hidden rounded-xl shadow-sm group cursor-pointer"
            >
              <img
                [src]="img.url"
                alt="Galerij afbeelding"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <!-- Overlay voor "+X meer" op de laatste foto -->
              @if (i === 3 && galleryImages.length > 4) {
                <div
                  class="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold"
                >
                  +{{ galleryImages.length - 3 }}
                </div>
              }
            </div>
          }
        </div>
      }
    </div>

    <!-- Slideshow Modal -->
    @if (isModalOpen) {
      <div
        class="fixed inset-0 z-100 bg-black/95 flex flex-col items-center justify-center transition-opacity duration-300"
        (click)="closeModal()"
      >
        <!-- Sluiten knop -->
        <button
          class="absolute top-6 right-6 text-white hover:text-gray-300 z-[110]"
          (click)="closeModal()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-8 h-8"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Vorige/Volgende Knoppen -->
        <button
          class="absolute left-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
          (click)="$event.stopPropagation(); prevImage()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-10 h-10"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          class="absolute right-4 top-1/2 -translate-y-1/2 text-white p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
          (click)="$event.stopPropagation(); nextImage()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            class="w-10 h-10"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <!-- Afbeelding container -->
        <div
          class="relative w-full max-w-5xl h-[80vh] flex items-center justify-center px-4"
          (click)="$event.stopPropagation()"
        >
          <img
            [src]="allImages[currentModalIndex]"
            class="max-w-full max-h-full object-contain rounded-md shadow-2xl transition-all duration-500"
            alt="Vergrote afbeelding"
          />
        </div>

        <!-- Teller -->
        <div class="mt-4 text-white font-medium">
          {{ currentModalIndex + 1 }} / {{ allImages.length }}
        </div>
      </div>
    }
  `,
})
export class ImagesKotpage implements OnChanges {
  @Input() images: any[] = [];

  mainImage: string | undefined;
  galleryImages: any[] = [];
  allImages: string[] = []; // Alle urls op een rij voor de slideshow

  isModalOpen = false;
  currentModalIndex = 0;

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.isModalOpen) return;
    if (event.key === 'Escape') this.closeModal();
    if (event.key === 'ArrowRight') this.nextImage();
    if (event.key === 'ArrowLeft') this.prevImage();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['images']) {
      this.updateImages();
    }
  }

  private updateImages(): void {
    if (!this.images) return;

    this.mainImage = this.images.find((img) => Number(img.document_type_id) === 7)?.url;
    this.galleryImages = this.images.filter((img) => Number(img.document_type_id) === 9);

    // Combineer alles voor de slideshow: Eerst hoofdfoto, dan galerij
    const combined = [];
    if (this.mainImage) combined.push(this.mainImage);
    this.galleryImages.forEach((img) => combined.push(img.url));
    this.allImages = combined;
  }

  openModal(index: number) {
    this.currentModalIndex = index;
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Stop scrolling van de pagina
  }

  closeModal() {
    this.isModalOpen = false;
    document.body.style.overflow = 'auto'; // Heractiveer scrolling
  }

  nextImage() {
    this.currentModalIndex = (this.currentModalIndex + 1) % this.allImages.length;
  }

  prevImage() {
    this.currentModalIndex =
      (this.currentModalIndex - 1 + this.allImages.length) % this.allImages.length;
  }
}
