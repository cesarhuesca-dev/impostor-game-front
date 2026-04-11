import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AvatarsComponent } from '@/shared/components/avatars/avatars.component';
import { WordGameComponent } from '@/shared/components/word-game/word-game.component';
import { CommonModule } from '@angular/common';
import { GameService } from '@/services/game.service';

@Component({
  selector: 'page-overlay',
  imports: [AvatarsComponent, WordGameComponent, CommonModule],
  templateUrl: './overlay.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OverlayComponent {
  private gameService = inject(GameService);
  readonly configuration = computed(() => this.gameService.configurationData());
}
