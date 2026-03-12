import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, minLength} from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { LoginGameInterface } from '@/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastMessageService } from '@/services/toast-message.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-join',
  imports: [ToggleSwitchModule, FormField, ButtonModule, TranslatePipe],
  providers : [MessageService],
  templateUrl: './join.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class JoinComponent {


  private gameService = inject(GameService);

  createGameModel = signal<LoginGameInterface>({
    roomName: '',
    roomPassword: ''
  });

  createGameForm = form(this.createGameModel, (schemaPath) => {
    required(schemaPath.roomName, { message: 'forms.error.room-name-required'});
    minLength(schemaPath.roomName, 3, { message: 'forms.error.room-name-min-length'});

    required(schemaPath.roomPassword, { message: 'forms.error.room-password-required'});
    minLength(schemaPath.roomPassword, 3, { message: 'forms.error.room-password-min-length'});

  });

  loginGame() {

    if(!this.createGameForm().valid()){
      return;
    }

    const data = this.createGameForm().value();

    this.gameService.loginGame(data);

  }

}
