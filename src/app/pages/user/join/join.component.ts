import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { form, FormField, required, minLength } from '@angular/forms/signals';
import { ButtonModule } from 'primeng/button';
import { LoginGameInterface } from 'src/app/core/interfaces/forms/game.interface';
import { GameService } from '@/services/game.service';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { UserModal } from '@/shared/components/user-modal/user-modal.component';
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/handle-response.service';
import { PlayerService } from '@/services/player.service';
import { Router } from '@angular/router';
import { UserModalInterface } from 'src/app/core/interfaces/forms/user-modal.interface';

@Component({
  selector: 'app-join',
  imports: [ToggleSwitchModule, FormField, ButtonModule, TranslatePipe, UserModal],
  providers: [MessageService],
  templateUrl: './join.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class JoinComponent {
  private readonly userModal = viewChild.required(UserModal);

  private readonly gameService = inject(GameService);
  private readonly loadingService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);
  private readonly playerService = inject(PlayerService);
  private readonly router = inject(Router);

  readonly joinGameModel = signal<LoginGameInterface>({
    roomName: '',
    roomPassword: '',
  });

  joinGameForm = form(this.joinGameModel, (schemaPath) => {
    required(schemaPath.roomName, { message: 'forms.error.room-name-required' });
    minLength(schemaPath.roomName, 3, { message: 'forms.error.room-name-min-length' });

    required(schemaPath.roomPassword, { message: 'forms.error.room-password-required' });
    minLength(schemaPath.roomPassword, 3, { message: 'forms.error.room-password-min-length' });
  });

  clearForm = () => {
    this.joinGameModel.update(() => ({
      roomName: '',
      roomPassword: '',
    }));
  };

  loginGame() {
    if (!this.joinGameForm().valid()) {
      return;
    }

    const data = this.joinGameForm().value();

    this.loadingService.addLoading();

    this.gameService.loginVerifyGame(data).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResposne(res, 'success.login-game-verify')) {
          this.userModal().openModal();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.login-game', this.clearForm),
    });
  }

  createNewPlayer(event: UserModalInterface) {
    const { name, playerImg } = event;

    const data: LoginGameInterface = {
      ...this.joinGameForm().value(),
      playerName: name,
      host: false,
    };

    this.loadingService.addLoading();
    this.gameService.loginGame(data).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResposne(res, 'success.login-game', false)) {
          this.playerService.startPlayer(res.data![0].token);

          if (playerImg !== null) {
            this.createPlayerImage(res.data![0], playerImg);
          } else {
            this.loadingService.finishLoading();
            this.goGame();
          }
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.login-game', this.clearForm),
    });
  }

  createPlayerImage(data: any, file: File) {
    this.playerService.uploadPlayerImage(data.player.id, file).subscribe({
      next: (res: any) => {
        if (this.handleResponseService.handleResposne(res, 'success.uploaded-image', true, this.clearForm)) {
          this.playerService.startPlayer(data.token);
          this.goGame();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning', this.clearForm),
    });
  }

  goGame() {
    this.router.navigate(['/game']);
  }
}
