import { GameService } from '@/services/game.service';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-game',
  imports: [AvatarModule, TranslatePipe],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent {


  private gameService = inject(GameService);

  private id = 1;

  game = this.gameService.game;

  player = computed(() => this.game().players.find( x => x.id === this.id ))


  showWord: boolean = false;
  ready: boolean = false;
}
