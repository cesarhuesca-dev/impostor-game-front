import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Toast } from 'primeng/toast';

@Component({
  selector: 's-exit-button',
  imports: [Button, Toast, ConfirmDialogModule, TranslateModule],
  templateUrl: './exit-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExitButton {

  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  acceptBtn = output<void>();
  cancelBtn = output<void>();

  confirmExit(event: Event) {

    this.translate.get('common').subscribe((res) => {

      const obj = {
        target: event.target as EventTarget,
        icon: 'pi pi-info-circle',


        acceptButtonStyleClass : 'btn-exit',
        rejectButtonStyleClass: 'btn-exit btn-exit-secondary',
        styleClass: "btn-exit",

        message: res['exit-confirm'],
        header: res['exit'],
        rejectButtonProps: {
          label: res['cancel'],
          severity: 'secondary',
        },
        acceptButtonProps: {
          label: res['exit'],
          severity: 'danger',
        },
        accept: () => this.acceptBtn.emit(),
        reject: () => this.cancelBtn.emit()
      }

      this.confirmationService.confirm(obj);


    })


  }
}
