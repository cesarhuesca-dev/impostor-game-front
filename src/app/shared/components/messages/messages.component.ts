import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ToastMessageService } from '@/services/toast-message.service';
import { ToastMessage } from '@/interfaces/utilities/toast-message.interface';
import { ToastPosition, ToastType } from 'src/app/core/enums/toast.enum';
import { NgTemplateOutlet } from '@angular/common';
import { DeviceService } from '@/services/device.service';
import { DeviceType } from '@/enums/device-type.enum';

@Component({
  selector: 's-messages',
  templateUrl: './messages.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ToastModule, NgTemplateOutlet],
  providers: [MessageService],
})
export class MessagesComponent {
  private messageService = inject(MessageService);
  private toastService = inject(ToastMessageService);
  private deviceService = inject(DeviceService);

  readonly deviceType = signal<DeviceType | null>(null);

  constructor() {
    this.setDevice();
    this.setEffectToast();
  }
  setDevice() {
    this.deviceService.getDeviceType().subscribe((device) => this.deviceType.update(() => device));
  }

  private setEffectToast() {
    effect(() => {
      const message = this.toastService.toastSignal();

      if (!message || Object.keys(message).length === 0) {
        return;
      }

      this.displayToast(message);
    });
  }

  getPositionByDevice(): ToastPosition {
    if (!this.deviceType()) {
      return ToastPosition.TOP_RIGHT;
    }

    switch (this.deviceType()) {
      case DeviceType.mobile:
        return ToastPosition.TOP_CENTER;
      case DeviceType.tablet:
        return ToastPosition.TOP_CENTER;
      case DeviceType.desktop:
        return ToastPosition.TOP_RIGHT;
      default:
        return ToastPosition.TOP_RIGHT;
    }
  }

  private displayToast(message: ToastMessage) {
    if (!message || Object.keys(message).length === 0) {
      return;
    }

    if (message) {
      this.messageService.add({
        ...message,
        severity: message['severity'] ?? ToastType.SUCCESS,
        key: this.getPositionByDevice(),
        life: 2000,
      });
    }
  }
}
