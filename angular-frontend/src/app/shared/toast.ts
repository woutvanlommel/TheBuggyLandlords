import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ActiveToast, ToastIconName, ToastProps, ToastVariant } from '../models/toast';

interface ToastStyle {
  icon: ToastIconName;
  classList: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toastSubject = new BehaviorSubject<ActiveToast[]>([]);
  readonly toast$ = this.toastSubject.asObservable();

  private timers = new Map<string, ReturnType<typeof setTimeout>>();

  show(props: ToastProps): string {
    const variant: ToastVariant = props.variant ?? 'info';
    const style = this.getStyle(variant, props.icon);
    const id = this.createId();

    const toast: ActiveToast = {
      id,
      title: props.title ?? 'Melding',
      message: props.message ?? '',
      variant,
      icon: style.icon,
      classList: style.classList,
      durationMs: props.durationMs ?? 4500,
      closable: props.closable ?? true,
    };

    this.toastSubject.next([toast, ...this.toastSubject.value]);

    if (toast.durationMs > 0) {
      const timer = setTimeout(() => this.dismiss(id), toast.durationMs);
      this.timers.set(id, timer);
    }

    return id;
  }

  dismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }

    this.toastSubject.next(this.toastSubject.value.filter((toast) => toast.id !== id));
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.toastSubject.next([]);
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

  private createId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
