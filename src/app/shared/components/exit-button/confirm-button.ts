import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';

@Component({
  selector: 's-confirm-button',
  imports: [Button, Toast, ConfirmDialogModule, TranslateModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './confirm-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmButton {

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  title = input<string>('common.exit');
  styles = input<string>('form-btn w-full btn-secondary btn-exit');
  icon = input<string>('🏃‍♂️');

  toastMessage = input<string>('common.exit-confirm');
  toastHeader = input<string>('common.exit');
  toastRejectLabel = input<string>('common.cancel');
  toastAcceptLabel = input<string>('common.exit');

  acceptBtn = output<void>();
  cancelBtn = output<void>();

  confirmExit(event: Event) {

    const obj = {
      target: event.target as EventTarget,
      icon: 'pi pi-info-circle',

      acceptButtonStyleClass : 'btn-exit',
      rejectButtonStyleClass: 'btn-exit btn-exit-secondary',
      styleClass: "btn-exit",

      message: this.translate.instant(this.toastMessage()),
      header: this.translate.instant(this.toastHeader()),
      rejectButtonProps: {
        label: this.translate.instant(this.toastRejectLabel()),
        severity: 'secondary',
      },
      acceptButtonProps: {
        label: this.translate.instant(this.toastAcceptLabel()),
        severity: 'danger',
      },
      accept: () => this.acceptBtn.emit(),
      reject: () => this.cancelBtn.emit()
    }

    this.confirmationService.confirm(obj);
  }
}
