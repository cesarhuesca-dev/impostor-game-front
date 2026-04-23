import { GameService } from '@/services/game.service';
import { PlayerService } from '@/services/player.service';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { ChangeDetectionStrategy, Component, computed, inject, OnDestroy, OnInit } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ConfirmButton } from '@/shared/components/exit-button/confirm-button';
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/utils/handle-response.service';
import { GameSocketService } from '@/services/websocket/game-socket.service';
import { ImpostorInfoComponent } from '@/shared/components/impostor-info/impostor-info.component';
import { NormalInfoComponent } from '@/shared/components/normal-info/normal-info.component';
import { InprogressInfoComponent } from '@/shared/components/inprogress-info/inprogress-info.component';
import { RoundTransitionComponent } from '@/shared/components/round-transition/round-transition.component';
import { CloseGameTransitionComponent } from '@/shared/components/close-game-transition/close-game-transition.component';
import { CloseGameService } from '@/services/close-game.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  imports: [
    AvatarModule,
    TranslatePipe,
    PlayerImagePipe,
    Button,
    ConfirmButton,
    ImpostorInfoComponent,
    NormalInfoComponent,
    InprogressInfoComponent,
    RoundTransitionComponent,
    CloseGameTransitionComponent,
  ],
  providers: [],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent implements OnInit, OnDestroy {
  private readonly gameService = inject(GameService);
  private readonly gameSocketService = inject(GameSocketService);
  private readonly playerService = inject(PlayerService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);
  private readonly closeGameService = inject(CloseGameService);
  private readonly translateService = inject(TranslateService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  readonly player = computed(() => this.playerService.playerData);
  readonly game = computed(() => {
    this.ready = false;
    this.showWord = false;
    return this.gameService.gameData;
  });
  readonly gamePlayer = computed(() => this.gameService.gameData?.players?.find((x) => x.id === this.player()?.id));

  showWord = false;
  ready = false;

  constructor() {
    this.translateService.get('title').subscribe((res) => {
      this.title.setTitle(res['game-page']);
      this.meta.updateTag({ property: 'og:title', content: res['game-page'] });
      this.meta.updateTag({ name: 'description', content: res['game-page-description'] });
      this.meta.updateTag({ property: 'og:description', content: res['game-page-description'] });
    });
  }

  ngOnInit(): void {
    this.startConnection();
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

  nextRound() {
    this.loaderService.addLoading();
    this.gameService.nextRound().subscribe({
      next: (res) => this.handleResponseService.handleResponse(res, 'success.game-next-round'),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  exitPlayer() {
    this.loaderService.addLoading();
    this.playerService.playerExit(this.player()!.id).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res, 'success.exit')) {
          this.closeGameService.startClosedGame();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }
}
