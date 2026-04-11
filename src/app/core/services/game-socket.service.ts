import { environment } from '@/assets/environments/environment.development';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manager, Socket } from 'socket.io-client';
import { PlayerService } from './player.service';
import { GameSocketTopic } from '@/enums/game-topics.enum';
import { SocketResponse } from '@/interfaces/socket-response.interface';
import { LoaderService } from './loader.service';
import { GameService } from './game.service';

@Injectable({ providedIn: 'root' })
export class GameSocketService {
  private readonly playerService = inject(PlayerService);
  private readonly loadingService = inject(LoaderService);
  private readonly gameService = inject(GameService);

  private socket: Socket | null = null;
  private readonly socketNamespace = '/game';

  connect() {
    this.loadingService.addLoading();

    const manager = new Manager(`${environment.URL_WS}/socket.io/socket.io.js`, {
      extraHeaders: {
        authorization: this.playerService.jwtPlayer,
      },
    });

    this.socket = manager.socket(this.socketNamespace);
    this.socket.on('connect', () => this.loadingService.finishLoading());
    this.listen(GameSocketTopic.PLAYER_MESSAGE)?.subscribe((msg) => this.handleGameMsg(msg));
  }

  disconnect() {
    if (!this.socket) {
      return;
    }

    this.socket.close();
    this.socket = null;
  }

  listen(eventName: string) {
    if (!this.socket) {
      return;
    }

    return new Observable<SocketResponse>((observer) => {
      this.socket!.on(eventName, (data) => {
        observer.next(JSON.parse(data));
      });
    });
  }

  handleGameMsg(msg: SocketResponse) {
    if (!msg.success) {
      return;
    }

    switch (msg.topic) {
      case GameSocketTopic.UPDATE_GAME_STATUS:
        console.log('GAME ACTUALIZADO', msg.data[0]);
        this.gameService.setGameData(msg.data[0]);
        break;
      case GameSocketTopic.UPDATE_PLAYER_STATUS:
        console.log('PLAYER ACTUALIZADO', msg.data[0]);
        this.playerService.setPlayerData(msg.data[0]);
        break;
      case GameSocketTopic.PLAYER_ELIMINATED:
        this.playerService.checkBanPlayer(msg.data[0]);
        break;
      case GameSocketTopic.CLOSE_GAME:
        this.playerService.closeGame();
        break;

      default:
        break;
    }
  }
}
