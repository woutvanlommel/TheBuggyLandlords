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
            class="word-fix block text-left"
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
      min-width: 0;
    }

    .word-fix {
      display: block;
      width: 100%;
    }

    /* HARD OVERRIDE op de Quill-output */
    .word-fix ::ng-deep .ql-editor {
      max-width: 100%;
    }

    .word-fix ::ng-deep p,
    .word-fix ::ng-deep span,
    .word-fix ::ng-deep strong,
    .word-fix ::ng-deep em {
      font-size: 1.125rem;
      line-height: 1.8;
      color: #374151;
    }

    .word-fix ::ng-deep p {
      margin-bottom: 1.25rem;
      display: block !important;
      max-width: 100%;
    }

    .word-fix ::ng-deep strong {
      font-weight: 800 !important;
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
