import { GameService } from '@/services/game.service';
import { PlayerService } from '@/services/player.service';
import { PlayerImagePipe } from '@/shared/pipes/player-image.pipe';
import { ChangeDetectionStrategy, Component, computed, HostListener, inject, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AvatarModule } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { ConfirmButton } from '@/shared/components/exit-button/confirm-button';
import { LoaderService } from '@/services/loader.service';
import { HandleResponseService } from '@/services/handle-response.service';
import { GameSocketService } from '@/services/game-socket.service';
import { ImpostorInfoComponent } from '@/shared/components/impostor-info/impostor-info.component';
import { NormalInfoComponent } from '@/shared/components/normal-info/normal-info.component';
import { InprogressInfoComponent } from '@/shared/components/inprogress-info/inprogress-info.component';

@Component({
  selector: 'app-game',
  imports: [AvatarModule, TranslatePipe, PlayerImagePipe, Button, ConfirmButton, ImpostorInfoComponent, NormalInfoComponent, InprogressInfoComponent],
  providers: [],
  templateUrl: './game.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GameComponent implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly gameSocketService = inject(GameSocketService);
  private readonly playerService = inject(PlayerService);
  private readonly loaderService = inject(LoaderService);
  private readonly handleResponseService = inject(HandleResponseService);

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  @HostListener('window:beforeunload', ['$event']) handleBeforeUnload(event: BeforeUnloadEvent) {
    //!TODO DETECTAR REFRESCO O CIERRE DE VENTANA PARA HACER EXIT
    // if (window.performance) {
    //   console.info("window.performance work's fine on this browser");
    // }
    // if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    //   console.info('This page is reloaded');
    // } else {
    //   console.info('This page is not reloaded');
    // }
    console.log(document);
  }

  readonly player = computed(() => this.playerService.playerData);
  readonly game = computed(() => {
    this.ready = false;
    this.showWord = false;
    return this.gameService.gameData;
  });
  readonly gamePlayer = computed(() => this.gameService.gameData?.players?.find((x) => x.id === this.player()?.id));

  showWord = false;
  ready = false;

  ngOnInit(): void {
    this.startWsGameConnection();
  }

  startWsGameConnection() {
    this.gameSocketService.connect();
  }

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

  nextRound() {
    this.loaderService.addLoading();
    this.gameService.nextRound().subscribe({
      next: (res) => this.handleResponseService.handleResponse(res),
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  exitPlayer() {
    this.loaderService.addLoading();
    this.playerService.playerExit(this.player()!.id).subscribe({
      next: (res) => {
        if (this.handleResponseService.handleResponse(res, 'success.exit')) {
          this.playerService.deletePlayerData();
          this.gameSocketService.disconnect();
        }
      },
      error: (error) => this.handleResponseService.handleError(error, 'error.warning'),
    });
  }

  //!TODO EN ALGUN MOMENTO CONECTAR CON WS
}
