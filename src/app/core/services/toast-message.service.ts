import { ToastMessage } from '@/interfaces/utilities/toast-message.interface';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastMessageService {
  readonly toastSignal = signal<ToastMessage | null>(null);

  getToast() {
    return this.toastSignal;
  }

  addMessage(message: ToastMessage) {
    this.toastSignal.update(() => ({ ...message }));
  }
}
