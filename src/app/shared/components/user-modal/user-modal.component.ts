import { UserModalInterface } from '@/interfaces/forms/user-modal.interface';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import {form, FormField, minLength, required} from '@angular/forms/signals';
import { TranslatePipe } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 's-user-modal',
  imports: [FormField, NgClass, TranslatePipe, ButtonModule],
  templateUrl: './user-modal.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModal {

  playerModel = signal<UserModalInterface>({ name: '', playerImg: null });
  playerImage = signal<string | ArrayBuffer | null>(null);

  playerForm = form(this.playerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'forms.error.player-name-required'});
    minLength(schemaPath.name, 3, { message: 'forms.error.player-name-min-length'});
  })

  isOpen = signal<boolean>(false);

  newPlayer = output<UserModalInterface>();
  cancelButton = output();

  openModal(){
    this.playerModel.update(() => ({ name: '', playerImg: null}));
    this.isOpen.update(()=> true);
  }

  closeModal() {
    this.playerModel.update(() => ({ name: '', playerImg: null}));
    this.isOpen.update(() => false);
    this.cancelButton.emit();
  }

  sendNewPlayer() {

    if(this.playerForm().invalid()){
      return;
    }

    this.newPlayer.emit(this.playerForm().value());
    this.closeModal();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {

      this.playerModel.update((value) => ({...value, playerImg: file }))

      const reader = new FileReader();
      reader.onload = () => this.playerImage.update(() => reader.result);
      reader.readAsDataURL(file);
    }
  }
}
