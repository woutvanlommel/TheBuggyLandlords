import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActiveToast, ToastIconName, ToastProps, ToastVariant } from '../models/toast';

interface ToastStyle {
  icon: ToastIconName;
  classList: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ActiveToast | null>(null);
  readonly toast$ = this.toastSubject.asObservable();

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(props: ToastProps): void {
    const variant: ToastVariant = props.variant ?? 'info';
    const style = this.getStyle(variant, props.icon);

    const toast: ActiveToast = {
      title: props.title ?? 'Melding',
      message: props.message ?? '',
      variant,
      icon: style.icon,
      classList: style.classList,
      durationMs: props.durationMs ?? 4500,
      closable: props.closable ?? true,
    };

    this.toastSubject.next(toast);

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (toast.durationMs > 0) {
      this.timer = setTimeout(() => this.dismiss(), toast.durationMs);
    }
  }

  dismiss(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    this.toastSubject.next(null);
  }

  private getStyle(variant: ToastVariant, customIcon?: ToastIconName): ToastStyle {
    const map: Record<ToastVariant, ToastStyle> = {
      success: {
        icon: 'heroCheckCircle',
        classList:
          'border-secondary-200 bg-linear-to-r from-secondary-100 to-base-een-100 text-base-twee-900',
      },
      info: {
        icon: 'heroInformationCircle',
        classList:
          'border-primary-200 bg-linear-to-r from-primary-100 to-base-een-100 text-base-twee-900',
      },
      warning: {
        icon: 'heroExclamationTriangle',
        classList:
          'border-accent-200 bg-linear-to-r from-accent-100 to-base-een-100 text-base-twee-900',
      },
      error: {
        icon: 'heroXCircle',
        classList: 'border-red-200 bg-linear-to-r from-red-100 to-base-een-100 text-base-twee-900',
      },
    };

    const selected = map[variant];
    return {
      icon: customIcon ?? selected.icon,
      classList: selected.classList,
    };
  }
}
