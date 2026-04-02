import { GameService } from '@/services/game.service';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 's-word-game',
  imports: [TranslatePipe],
  templateUrl: './word-game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordGameComponent {

  private gameService = inject(GameService)

  game = computed( () => this.gameService.gameData);


}

