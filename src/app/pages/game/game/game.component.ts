import { GameService } from '@/services/game.service';
import { PlayerService } from '@/services/player.service';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { Button } from "primeng/button";

@Component({
  selector: 'app-game',
  imports: [AvatarModule, TranslatePipe, PlayerImagePipe, Button],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent implements OnInit {

  private readonly gameService = inject(GameService);
  private readonly playerService = inject(PlayerService);

  player = computed(() => this.playerService.playerData)
  game = computed(() => this.gameService.gameData);


  showWord: boolean = false;
  ready: boolean = false;

  ngOnInit(): void {
    this.gameService.getGame(this.player()!.game.id);
  }

  startGame(){
    console.log('EMPEZAR PARTIDA')
  }

  //!TODO EN ALGUN MOMENTO CONECTAR CON WS


}
