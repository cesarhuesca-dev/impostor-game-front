import { ToastType } from '@/enums/toast.enum';
import { ToastMessage } from '@/interfaces/utilities/toast-message.interface';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastMessageService {
  readonly toastSignal = signal<ToastMessage | null>(null);

  getToast() {
    return this.toastSignal;
  }

  addMessage(message: ToastMessage) {
    let icon = '';

    switch (message.severity) {
      case ToastType.INFO:
        icon = 'ⓘ';
        break;
      case ToastType.SUCCESS:
        icon = '✓';
        break;
      case ToastType.ERROR:
        icon = '✕';
        break;
      default:
        break;
    }

    this.toastSignal.update(() => ({ ...message, icon }));
    setTimeout(() => this.toastSignal.update(() => null), 2000);
  }
}
