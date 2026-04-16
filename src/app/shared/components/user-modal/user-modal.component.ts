import { UserModalInterface } from 'src/app/core/interfaces/forms/user-modal.interface';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { form, FormField, minLength, required } from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 's-user-modal',
  imports: [FormField, NgClass, TranslatePipe, ButtonModule],
  templateUrl: './user-modal.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModal {
  readonly playerModel = signal<UserModalInterface>({ name: '', playerImg: null });
  readonly playerImage = signal<string | ArrayBuffer | null>(null);

  playerForm = form(this.playerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'forms.error.player-name-required' });
    minLength(schemaPath.name, 3, { message: 'forms.error.player-name-min-length' });
  });

  readonly isOpen = signal<boolean>(false);

  readonly createPage = input<boolean>(false);
  readonly newPlayer = output<UserModalInterface>();
  readonly newNoPlayer = output();
  readonly cancelButton = output();

  openModal() {
    this.playerModel.update(() => ({ name: '', playerImg: null }));
    this.isOpen.update(() => true);
  }

  closeModal() {
    this.playerModel.update(() => ({ name: '', playerImg: null }));
    this.isOpen.update(() => false);
    this.cancelButton.emit();
  }

  sendNewPlayer() {
    if (this.playerForm().invalid()) {
      return;
    }

    this.newPlayer.emit(this.playerForm().value());
    this.isOpen.update(() => false);
  }

  sendNoPlayer() {
    this.newNoPlayer.emit();
    this.isOpen.update(() => false);
  }

  onFileSelected(event: Event) {
    const inputElement = event.target as HTMLInputElement;

    const file = inputElement.files && inputElement.files[0] ? inputElement.files[0] : null;

    if (file) {
      this.playerModel.update((value) => ({ ...value, playerImg: file }));

      const reader = new FileReader();
      reader.onload = () => this.playerImage.update(() => reader.result);
      reader.readAsDataURL(file);
    }
  }
}
