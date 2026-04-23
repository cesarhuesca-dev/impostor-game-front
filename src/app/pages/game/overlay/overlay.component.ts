import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { AvatarsComponent } from '@/shared/components/avatars/avatars.component';
import { WordGameComponent } from '@/shared/components/word-game/word-game.component';
import { CommonModule } from '@angular/common';
import { SettingsService } from '@/services/utils/settings.service';
import { GameSocketService } from '@/services/websocket/game-socket.service';
import { PlayerService } from '@/services/player.service';
import { CloseGameTransitionComponent } from '@/shared/components/close-game-transition/close-game-transition.component';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

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
  private readonly translateService = inject(TranslateService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  readonly user = computed(() => this.playerService.playerData!);
  readonly configuration = computed(() => this.settingsService.getSettings());

  constructor() {
    this.translateService.get('title').subscribe((res) => {
      this.title.setTitle(res['overlay-page']);
      this.meta.updateTag({ property: 'og:title', content: res['overlay-page'] });
      this.meta.updateTag({ name: 'description', content: res['overlay-page-description'] });
      this.meta.updateTag({ property: 'og:description', content: res['overlay-page-description'] });
    });
  }

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
