import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { AvatarsComponent } from '@/shared/components/avatars/avatars.component';
import { WordGameComponent } from '@/shared/components/word-game/word-game.component';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@/services/utils/settings.service';
import { GameSocketService } from '@/services/websocket/game-socket.service';
import { PlayerService } from '@/services/player.service';
import { CloseGameTransitionComponent } from '@/shared/components/close-game-transition/close-game-transition.component';

@Component({
  selector: 'page-overlay',
  imports: [AvatarsComponent, WordGameComponent, CommonModule, CloseGameTransitionComponent],
  templateUrl: './overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OverlayComponent implements OnInit, OnDestroy {
  private readonly settingsService = inject(SettingsService);
  private readonly gameSocketService = inject(GameSocketService);
  private readonly playerService = inject(PlayerService);

  readonly user = computed(() => this.playerService.playerData!);
  readonly configuration = computed(() => this.settingsService.getSettings());

  ngOnInit(): void {
    this.startConnection();
  }

  ngOnDestroy(): void {
    this.closeConnection();
  }

  startConnection() {
    this.gameSocketService.connect(this.playerService.jwtPlayer);
  }

  closeConnection() {
    this.gameSocketService.disconnect();
  }
}
