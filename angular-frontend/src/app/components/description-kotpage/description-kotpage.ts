import { Component, Input } from '@angular/core';
import { QuillViewHTMLComponent } from 'ngx-quill';

@Component({
  selector: 'app-description-kotpage',
  standalone: true,
  imports: [QuillViewHTMLComponent],
  template: `
    <div class="w-full">
      @if (description) {
        <div class="max-w-full">
          <h2 class="text-[clamp(1.5rem,2vw,3rem)] font-semibold mb-4">Beschrijving</h2>
          <quill-view-html
            [content]="description"
            theme="snow"
            class="word-fix block text-left"
          ></quill-view-html>
        </div>
      }

      <div class="mt-4 text-gray-600">
        <p>{{ street }} {{ houseNumber }}, {{ postalCode }} {{ city }}</p>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
    }
    /* Overschrijf alle agressieve word-breaking gedrag */
    .word-fix ::ng-deep .ql-editor,
    .word-fix ::ng-deep .ql-editor * {
      padding: 0 !important;
      word-break: normal !important;
      overflow-wrap: break-word !important; /* Breekt pas als het echt moet, voorkomt splitsen in het midden van woorden */
      word-wrap: break-word !important;
      hyphens: none !important;
      text-align: left !important;
    }
    .word-fix ::ng-deep .ql-container.ql-snow {
      border: none !important;
      font-size: 1.125rem; /* komt overeen met prose-lg */
      line-height: 1.75;
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
