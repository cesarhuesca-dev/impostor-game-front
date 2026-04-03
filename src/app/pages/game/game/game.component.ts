import { GameService } from '@/services/game.service';
import { PlayerService } from '@/services/player.service';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { Button } from "primeng/button";
import { MessageService, ConfirmationService } from 'primeng/api';
import { ExitButton } from "@/shared/components/exit-button/exit-button";
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/handle-response.service';

@Component({
  selector: 'app-game',
  imports: [AvatarModule, TranslatePipe, PlayerImagePipe, Button, ExitButton],
  providers: [ConfirmationService, MessageService],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent implements OnInit {

  private readonly gameService = inject(GameService);
  private readonly playerService = inject(PlayerService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);


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

  exitPlayer(){
    this.loaderService.addLoading()
    this.playerService.playerExit(this.player()!.id).subscribe({
      next: (res: any) => {
        if(this.handleResponseService.handleResposne(res, 'success.exit')){
          this.playerService.deletePlayerData();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning')
    })
  }

  //!TODO EN ALGUN MOMENTO CONECTAR CON WS


}
