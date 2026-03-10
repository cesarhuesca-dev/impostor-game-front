import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, minLength} from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { LoginGameInterface } from '@/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-join',
  imports: [ToggleSwitchModule, FormField, ButtonModule, TranslatePipe],
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
    required(schemaPath.roomName);
    minLength(schemaPath.roomName, 3);

    required(schemaPath.roomPassword);
    minLength(schemaPath.roomPassword, 3);

  });

  loginGame() {

    if(!this.createGameForm().valid()){
      return;
    }

    const data = this.createGameForm().value();

    this.gameService.loginGame(data);
  }

}
