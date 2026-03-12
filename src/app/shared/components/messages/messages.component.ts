import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastMessageService } from '@/services/toast-message.service';
import { ToastMessage } from '@/interfaces/toast-message.interface';
import { ToastPosition, ToastType } from '@/enums/toast.enum';

@Component({
  selector: 's-messages',
  templateUrl: './messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastModule],
  providers: [MessageService]

})
export class MessagesComponent {

  private messageService = inject(MessageService);
  private toastService = inject(ToastMessageService);

  constructor() {
    this.setEffectToast();
  }

  private setEffectToast(){
    effect(() => {
      const message = this.toastService.toastSignal();

      if(!message || Object.keys(message).length === 0){
        return;
      }

      this.displayToast(message);
    });
  }

  private displayToast(message: ToastMessage){

    if(!message ||Object.keys(message).length === 0){
      return;
    }

    if (message) {
      this.messageService.add({
        ...message,
        severity: message['severity'] ?? ToastType.INFO,
        key: message['key'] ?? ToastPosition.TOP_RIGHT
      });
    }
  }
}
