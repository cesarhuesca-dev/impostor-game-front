import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe } from '@ngx-translate/core';
import { GameService } from '@/services/game.service';
import { AvatarModule } from 'primeng/avatar';
import { NgClass } from '@angular/common';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { PlayerService } from '@/services/player.service';
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/handle-response.service';
import { ConfirmButton } from '@/shared/components/exit-button/confirm-button';
import { ItemListInterface } from '@/interfaces/utilities/list.interface';
import { AuxiliarService } from '@/services/auxiliar.service';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manager',
  imports: [ButtonModule, TranslatePipe, AvatarModule, NgClass, PlayerImagePipe, ConfirmButton, Dialog, FormsModule],
  templateUrl: './manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManagerComponent implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly playerService = inject(PlayerService);
  private readonly auxiliarService = inject(AuxiliarService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);

  readonly game = computed(() => this.gameService.gameData);
  readonly player = computed(() => this.playerService.playerData!);
  readonly gameCategories = signal<ItemListInterface[]>([]);
  readonly titleCategoryGame = computed<string>(() => this.gameCategories().find((x) => x.value === this.game()?.category)?.label ?? '');

  readonly customWord = signal<string>('');
  visibleChangeWord = false;
  customWordRound = false;

  readonly category = signal<string>('');
  visible = false;

  ngOnInit(): void {
    this.setGameCategories();

    console.log('this.game', this.game());
  }

  setGameCategories() {
    this.loaderService.addLoading();
    this.auxiliarService.getCategories().subscribe((categories) => {
      this.gameCategories.update(() => categories);
      this.loaderService.finishLoading();
    });
  }

  //#region CONTROLES CON JUGADORES

  banPlayer(idPlayer: string) {
    this.loaderService.addLoading();
    this.playerService.playerExit(idPlayer).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'success.ban-player'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  //#endregion

  //#region CONTROLES DE PARTIDA

  startGame() {
    this.loaderService.addLoading();
    this.gameService.startGame().subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res) && res.data && res.data[0]!.gameStarted && res.data![0].round === 0) {
          this.nextRound();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  endGame() {
    this.loaderService.addLoading();
    this.gameService.endGame().subscribe({
      next: (res) => this.handleResponseService.handleResponse(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  closeGame() {
    this.loaderService.addLoading();
    this.gameService.closeGame(this.game()!.id).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'common.closed-game'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  clickNextRound() {
    if (this.game()?.customWords) {
      this.customWord.update(() => '');
      this.customWordRound = true;
      this.visibleChangeWord = true;
    } else {
      this.nextRound(null);
    }
  }

  nextRound(word: string | null = null) {
    this.visibleChangeWord = false;
    this.loaderService.addLoading();
    this.gameService.nextRound(word).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  //#endregion

  //#region CONTROLES DE RONDA

  clickChangeWord() {
    if (this.game()?.customWords) {
      this.customWord.update(() => '');
      this.customWordRound = false;
      this.visibleChangeWord = true;
    } else {
      this.changeWord(null);
    }
  }

  changeWord(word: string | null = null) {
    this.visibleChangeWord = false;
    this.loaderService.addLoading();
    this.gameService.changeWordGame(word).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  openChangeCategory() {
    this.category.update(() => {
      const category = this.gameCategories().find((x) => x.value === this.game()?.category);
      return category ? category.value : '';
    });

    this.visible = true;
  }

  clickCategory(event: Event) {
    const target = event?.target as HTMLSelectElement;
    this.category.update(() => target.value ?? '');
  }

  changeCategory() {
    this.visible = false;
    this.loaderService.addLoading();
    this.gameService.changeCategoryGame(this.game()!.id, this.category()).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  //#endregion
}
