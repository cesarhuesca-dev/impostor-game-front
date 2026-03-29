import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import {form, FormField, minLength, required} from '@angular/forms/signals';

@Component({
  selector: 's-user-modal',
  imports: [FormField, NgClass],
  templateUrl: './user-modal.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserModal {

  playerModel = signal({ name: '' });
  playerForm = form(this.playerModel, (schemaPath) => {
    required(schemaPath.name, { message: 'forms.error.player-name-required'});
    minLength(schemaPath.name, 3, { message: 'forms.error.player-name-min-length'});
  })

  isOpen = signal<boolean>(false);

  previewImage: string | ArrayBuffer | null = null;
  selectedFile!: File;

  newPlayer = output<{name:string}>();
  cancelButton = output();

  openModal(){
    this.playerModel.update(() => ({ name: ''}));
    this.isOpen.update(()=> true);
  }

  closeModal() {
    this.playerModel.update(() => ({ name: ''}));
    this.isOpen.update(() => false);
    this.cancelButton.emit();
  }

  sendNewPlayer() {

    if(this.playerForm().invalid()){
      return;
    }

    const value = this.playerForm().value();
    this.newPlayer.emit(value);
    this.closeModal();
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
}
