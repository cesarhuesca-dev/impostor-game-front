import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { GameService } from '@/services/game.service';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';

@Component({
  selector: 's-avatars',
  imports: [AvatarModule, CommonModule, PlayerImagePipe],
  templateUrl: './avatars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarsComponent {
  private gameService = inject(GameService);
  readonly game = computed(() => this.gameService.gameData);
  readonly players = computed(() => this.game()!.players?.sort((a, b) => a.createdAt - b.createdAt));
}
