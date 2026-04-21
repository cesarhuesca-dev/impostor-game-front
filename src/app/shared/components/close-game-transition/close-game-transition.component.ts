import { CloseGameService } from '@/services/close-game.service';
import { GameSocketService } from '@/services/websocket/game-socket.service';
import { PlayerService } from '@/services/player.service';
import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';
import { GameService } from '@/services/game.service';

@Component({
  selector: 's-closed-game-transition',
  imports: [TranslatePipe, Button],
  templateUrl: './close-game-transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseGameTransitionComponent {
  private closeGameService = inject(CloseGameService);
  private playerService = inject(PlayerService);
  private gameService = inject(GameService);
  private gameSocketService = inject(GameSocketService);

  readonly transition = input<boolean>(true);

  readonly started = computed(() => this.closeGameService.started());
  readonly startedBanned = computed(() => this.closeGameService.startedBanned());
  readonly show = computed(() => this.closeGameService.show());

  constructor() {
    effect(() => {
      if ((this.started() || this.startedBanned()) && !this.transition()) {
        this.deleteData();
      }
    });
  }

  goHome() {
    this.deleteData();
  }

  deleteData() {
    this.gameService.deleteGameData();
    this.playerService.deletePlayerData(this.transition());
    this.gameSocketService.disconnect();
    this.closeGameService.finishClosedGame();
  }
}
