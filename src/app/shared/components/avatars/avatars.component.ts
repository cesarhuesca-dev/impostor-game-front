import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { GameService } from '@/services/game.service';

@Component({
  selector: 's-avatars',
  imports: [AvatarModule, CommonModule],
  templateUrl: './avatars.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarsComponent {

  private gameService = inject(GameService);
  game = this.gameService.gameData;

}
