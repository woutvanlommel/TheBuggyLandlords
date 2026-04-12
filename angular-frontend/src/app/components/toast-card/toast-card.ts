import { AsyncPipe, NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  heroCheckCircle,
  heroInformationCircle,
  heroExclamationTriangle,
  heroXCircle,
  heroXMark,
} from '@ng-icons/heroicons/outline';
import { ToastService } from '../../shared/toast';

@Component({
  selector: 'app-toast-card',
  standalone: true,
  imports: [AsyncPipe, NgClass, NgIcon],
  providers: [
    provideIcons({
      heroCheckCircle,
      heroInformationCircle,
      heroExclamationTriangle,
      heroXCircle,
      heroXMark,
    }),
  ],
  template: `
    @if (toasts$ | async; as toasts) {
      @if (toasts.length > 0) {
        <div class="fixed top-6 right-6 z-50 w-[min(92vw,24rem)] space-y-3 pointer-events-none">
          @for (toast of toasts; track toast.id) {
            <div
              class="rounded-xl border shadow-xl backdrop-blur-sm toast-enter pointer-events-auto"
              [ngClass]="toast.classList"
            >
              <div class="p-4 pr-11 relative">
                <div class="flex items-start gap-3">
                  <ng-icon [name]="toast.icon" class="mt-0.5 text-xl"></ng-icon>

                  <div class="min-w-0">
                    <p class="font-bold text-sm">{{ toast.title }}</p>
                    <p class="text-sm text-base-twee-700 mt-1">{{ toast.message }}</p>
                  </div>
                </div>

                @if (toast.closable) {
                  <button
                    type="button"
                    class="absolute top-2 right-2 rounded-md p-1 text-base-twee-500 hover:bg-base-een-100/70 hover:text-base-twee-700 transition-colors"
                    aria-label="Sluit melding"
                    (click)="dismiss(toast.id)"
                  >
                    <ng-icon name="heroXMark" class="text-base"></ng-icon>
                  </button>
                }
              </div>
            </div>
          }
        </div>
      }
    }
  `,
  styles: [
    `
      .toast-enter {
        animation: toast-enter 220ms ease-out;
      }

      @keyframes toast-enter {
        from {
          opacity: 0;
          transform: translate3d(18px, -8px, 0);
        }
        to {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
      }
    `,
  ],
})
export class ToastCard {
  private toastService = inject(ToastService);
  readonly toasts$ = this.toastService.toast$;

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
