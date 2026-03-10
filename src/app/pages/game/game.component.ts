import { ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { AvatarsComponent } from "@/shared/components/avatars/avatars.component";
import { WordGameComponent } from "@/shared/components/word-game/word-game.component";
import { CommonModule } from '@angular/common';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'page-game',
  imports: [
    AvatarsComponent,
    WordGameComponent,
    CommonModule
  ],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent {

  private gameService = inject(GameService);

  configuration = computed(() => this.gameService.configuration())

}
