import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '@/services/game.service';
import { WordGame } from 'src/app/core/interfaces/game.interface';
import { AvatarModule } from 'primeng/avatar';
import { NgClass } from '@angular/common';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { PlayerService } from '@/services/player.service';
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/handle-response.service';
import { ExitButton } from "@/shared/components/exit-button/exit-button";

@Component({
  selector: 'app-manager',
  imports: [ButtonModule, TranslatePipe, AvatarModule, NgClass, PlayerImagePipe, ExitButton],
  templateUrl: './manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManagerComponent implements OnInit {

  private readonly gameService = inject(GameService);
  private readonly playerService = inject(PlayerService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);

  game = computed(() => this.gameService.gameData);
  player = computed(() => this.playerService.playerData!);


  ngOnInit(): void {

    console.log('this.game', this.game())

  }

  //#region CONTROLES CON JUGADORES

  banPlayer(idPlayer: string) {
    this.loaderService.addLoading();
    this.playerService.playerExit(idPlayer).subscribe({
      next: (res: any) => this.handleResponseService.handleResposne(res, 'success.ban-player'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning')
    });
  }

  //#endregion

  //#region CONTROLES DE PARTIDA

  startGame() {
    this.loaderService.addLoading();
    this.gameService.startGame().subscribe({
      next: (res: any) => this.handleResponseService.handleResposne(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning')
    });
  }

  endGame() {
    this.loaderService.addLoading();
    this.gameService.endGame().subscribe({
      next: (res: any) => this.handleResponseService.handleResposne(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning')
    });
  }

  closeGame() {
    this.loaderService.addLoading();
    this.gameService.closeGame(this.game()!.id).subscribe({
      next: (res: any) => this.handleResponseService.handleResposne(res, 'common.closed-game'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning')
    });
  }

  nextRound() {
    this.loaderService.addLoading();
    this.gameService.nextRound().subscribe({
      next: (res: any) => this.handleResponseService.handleResposne(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning')
    });
  }


  //#endregion

  //#region CONTROLES DE RONDA

  changeWord() {
    const newWord : WordGame = {
      word: 'Pruebas',
      category: ''
    }

    this.gameService.changeWordGame(newWord);
  }

  changeCategory() {
    const newCategory : WordGame = {
      word: '',
      category: 'Pruebas'
    }

    this.gameService.changeWordGame(newCategory);
  }

  showWord() {
    this.gameService.toggleShowWord();
  }

  showImpostor() {
    this.gameService.toggleShowImpostor();
  }

  //#endregion


}
