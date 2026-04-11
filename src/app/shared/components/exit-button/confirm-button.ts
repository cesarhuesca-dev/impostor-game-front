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

  readonly title = input<string>('common.exit');
  readonly styles = input<string>('form-btn w-full btn-secondary btn-exit');
  readonly icon = input<string>('🏃‍♂️');

  readonly toastMessage = input<string>('common.exit-confirm');
  readonly toastHeader = input<string>('common.exit');
  readonly toastRejectLabel = input<string>('common.cancel');
  readonly toastAcceptLabel = input<string>('common.exit');

  readonly acceptBtn = output<void>();
  readonly cancelBtn = output<void>();

  confirmExit(event: Event) {
    const obj = {
      target: event.target as EventTarget,
      icon: 'pi pi-info-circle',

      acceptButtonStyleClass: 'btn-exit',
      rejectButtonStyleClass: 'btn-exit btn-exit-secondary',
      styleClass: 'btn-exit',

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
      reject: () => this.cancelBtn.emit(),
    };

    this.confirmationService.confirm(obj);
  }
}
