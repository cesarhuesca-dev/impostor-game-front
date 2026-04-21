import { CloseGameService } from '@/services/close-game.service';
import { GameSocketService } from '@/services/game-socket.service';
import { PlayerService } from '@/services/player.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Button } from 'primeng/button';

@Component({
  selector: 's-closed-game-transition',
  imports: [TranslatePipe, Button],
  templateUrl: './close-game-transition.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CloseGameTransitionComponent {
  private closeGameService = inject(CloseGameService);
  private playerService = inject(PlayerService);
  private gameSocketService = inject(GameSocketService);

  readonly started = computed(() => this.closeGameService.started());
  readonly show = computed(() => this.closeGameService.show());

  goHome() {
    this.deleteData();
  }

  deleteData() {
    this.playerService.deletePlayerData();
    this.gameSocketService.disconnect();
    this.closeGameService.finishClosedGame();
  }
}
