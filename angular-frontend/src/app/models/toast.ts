export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export type ToastIconName =
  | 'heroCheckCircle'
  | 'heroInformationCircle'
  | 'heroExclamationTriangle'
  | 'heroXCircle';

export interface ToastProps {
  title?: string;
  message?: string;
  variant?: ToastVariant;
  icon?: ToastIconName;
  durationMs?: number;
  closable?: boolean;
}

export interface ActiveToast {
  title: string;
  message: string;
  variant: ToastVariant;
  icon: ToastIconName;
  classList: string;
  durationMs: number;
  closable: boolean;
}
