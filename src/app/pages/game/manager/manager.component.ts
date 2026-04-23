import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { GameService } from '@/services/game.service';
import { AvatarModule } from 'primeng/avatar';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { PlayerService } from '@/services/player.service';
import { LoaderService } from '@/services/loader.service';
import { ConfirmButton } from '@/shared/components/exit-button/confirm-button';
import { ItemListInterface } from '@/interfaces/utilities/list.interface';
import { AuxiliarService } from '@/services/auxiliar.service';
import { Dialog } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { CloseGameTransitionComponent } from '@/shared/components/close-game-transition/close-game-transition.component';
import { HandleResponseService } from '@/services/utils/handle-response.service';
import { GameSocketService } from '@/services/websocket/game-socket.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-manager',
  imports: [ButtonModule, TranslatePipe, AvatarModule, PlayerImagePipe, ConfirmButton, Dialog, FormsModule, CloseGameTransitionComponent],
  templateUrl: './manager.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ManagerComponent implements OnInit, OnDestroy {
  private readonly gameSocketService = inject(GameSocketService);
  private readonly gameService = inject(GameService);
  private readonly playerService = inject(PlayerService);
  private readonly auxiliarService = inject(AuxiliarService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);
  private readonly translateService = inject(TranslateService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  readonly game = computed(() => this.gameService.gameData);
  readonly player = computed(() => this.playerService.playerData!);
  readonly gameCategories = signal<ItemListInterface[]>([]);
  readonly titleCategoryGame = computed<string>(() => this.gameCategories().find((x) => x.value === this.game()?.category)?.label ?? '');

  readonly customWord = signal<string>('');
  visibleChangeWord = false;
  customWordRound = false;

  readonly category = signal<string>('');
  visible = false;

  constructor() {
    this.translateService.get('title').subscribe((res) => {
      this.title.setTitle(res['manager-page']);
      this.meta.updateTag({ property: 'og:title', content: res['manager-page'] });
      this.meta.updateTag({ name: 'description', content: res['manager-page-description'] });
      this.meta.updateTag({ property: 'og:description', content: res['manager-page-description'] });
    });
  }

  ngOnInit(): void {
    this.startConnection();
    this.setGameCategories();
  }

  ngOnDestroy(): void {
    this.closeConnection();
  }

  startConnection() {
    this.gameSocketService.connect(this.playerService.jwtPlayer);
  }

  closeConnection() {
    this.gameSocketService.disconnect();
  }

  setGameCategories() {
    this.loaderService.addLoading();
    this.auxiliarService.getCategories().subscribe((categories) => {
      this.gameCategories.update(() => categories);
      this.loaderService.finishLoading();
    });
  }

  //#region CONTROLES DE PARTIDA

  banPlayer(idPlayer: string) {
    this.loaderService.addLoading();
    this.playerService.playerBan(idPlayer).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'success.ban-player'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  startGame() {
    this.loaderService.addLoading();
    this.gameService.startGame().subscribe({
      next: (res) => {
        if (
          this.handleResponseService.handleResponse(res, 'success.game-started') &&
          res.data &&
          res.data[0]!.gameStarted &&
          res.data![0].round === 0
        ) {
          this.nextRound();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  endGame() {
    this.loaderService.addLoading();
    this.gameService.endGame().subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'success.game-finish'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  closeGame() {
    this.loaderService.addLoading();
    this.gameService.closeGame(this.game()!.id).subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'success.game-closed'),
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
      next: (res) => this.handleResponseService.handleResponse(res, 'success.game-next-round'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

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
      next: (res) => this.handleResponseService.handleResponse(res, 'success.game-change-word'),
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
      next: (res) => this.handleResponseService.handleResponse(res, 'success.game-change-category'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  //#endregion
}
