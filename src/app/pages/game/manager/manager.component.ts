import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '@/services/game.service';
import { WordGame } from 'src/app/core/interfaces/game.interface';
import { AvatarModule } from 'primeng/avatar';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-manager',
  imports: [ButtonModule, TranslatePipe, AvatarModule, NgClass],
  templateUrl: './manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManagerComponent implements OnInit {


  private gameService = inject(GameService);

  game = this.gameService.gameData;


  ngOnInit(): void {

    console.log('this.game', this.game)

  }

  //#region CONTROLES CON JUGADORES

  banPlayer(idPlayer: string) {
    this.gameService.banPlayer(idPlayer);
  }

  //#endregion

  //#region CONTROLES DE PARTIDA

  nextRound() {
    this.gameService.nextRound();
  }

  startGame() {
    this.gameService.startGame();
  }

  closeGame() {
    this.gameService.closeGame();
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
