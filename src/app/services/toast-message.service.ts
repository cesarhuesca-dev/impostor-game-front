import { ToastMessage } from 'src/app/core/interfaces/toast-message.interface';
import { Injectable, signal } from '@angular/core';

@Injectable({providedIn: 'root'})
export class ToastMessageService {


  toastSignal = signal<ToastMessage | null>(null);

  getToast() {
    return this.toastSignal;
  }

  addMessage(message: ToastMessage) {
    this.toastSignal.update(() => ({...message}));
  }

}


