import { Component, Input } from '@angular/core';
import { QuillViewHTMLComponent } from 'ngx-quill';

@Component({
  selector: 'app-description-kotpage',
  standalone: true,
  imports: [QuillViewHTMLComponent],
  template: `
    <div class="w-full">
      @if (description) {
        <div class="max-w-full overflow-hidden">
          <h2 class="text-[clamp(1.5rem,2vw,3rem)] font-semibold mb-4 text-base-twee-900">
            Beschrijving
          </h2>
          <quill-view-html
            [content]="description"
            theme="snow"
            class="word-fix block text-left !break-normal"
          ></quill-view-html>
        </div>
      } @else {
        <div class="max-w-full overflow-hidden">
          <h2 class="text-[clamp(1.5rem,2vw,3rem)] font-semibold mb-4 text-base-twee-900">
            Beschrijving
          </h2>
          <p class="text-md text-zinc-300">Nog geen beschrijving</p>
        </div>
      }

      <div class="mt-8 text-gray-500 border-t border-gray-100 pt-4">
        <p class="text-sm italic">{{ street }} {{ houseNumber }}, {{ postalCode }} {{ city }}</p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    /* Forceer normale woordafbreking en voorkom splitsen in het midden */
    .word-fix ::ng-deep * {
      word-break: normal !important;
      overflow-wrap: break-word !important;
      word-wrap: break-word !important;
      hyphens: none !important;
    }

    /* Specifieke styling voor de Quill-container om de tekst weer netjes te maken */
    .word-fix ::ng-deep .ql-container.ql-snow {
      border: none !important;
      font-size: 1.125rem;
      line-height: 1.8;
      color: #374151; /* Tailwind gray-700 */
      font-family: inherit;
    }

    .word-fix ::ng-deep .ql-editor {
      padding: 0 !important;
    }

    /* Zorg dat paragrafen zich gedragen als blokken */
    .word-fix ::ng-deep p {
      margin-bottom: 1.25rem;
      display: block !important;
    }
  `,
})
export class DescriptionKotpage {
  @Input() description: string | null = null;
  @Input() street: string | null = null;
  @Input() houseNumber: string | null = null;
  @Input() postalCode: string | null = null;
  @Input() city: string | null = null;
}
