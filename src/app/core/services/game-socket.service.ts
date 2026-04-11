import { environment } from '@/assets/environments/environment.development';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manager, Socket } from 'socket.io-client';
import { PlayerService } from './player.service';
import { GameSocketTopic } from '@/enums/game-topics.enum';
import { SocketResponse } from '@/interfaces/socket-response.interface';
import { LoaderService } from './loader.service';
import { GameService } from './game.service';
import { Game, Player } from '@/interfaces/game.interface';

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

    return new Observable<SocketResponse<unknown>>((observer) => {
      this.socket!.on(eventName, (data) => {
        observer.next(JSON.parse(data));
      });
    });
  }

  handleGameMsg(msg: SocketResponse<unknown>) {
    if (!msg.success) {
      return;
    }

    switch (msg.topic) {
      case GameSocketTopic.UPDATE_GAME_STATUS: {
        const msgInfo = msg as SocketResponse<Game[]>;
        this.gameService.setGameData(msgInfo.data[0]);
        console.log('GAME ACTUALIZADO', msgInfo.data[0]);
        break;
      }
      case GameSocketTopic.UPDATE_PLAYER_STATUS: {
        const msgInfo = msg as SocketResponse<Player[]>;
        this.playerService.setPlayerData(msgInfo.data[0]);
        console.log('PLAYER ACTUALIZADO', msgInfo.data[0]);
        break;
      }
      case GameSocketTopic.PLAYER_ELIMINATED: {
        const msgInfo = msg as SocketResponse<string[]>;
        this.playerService.checkBanPlayer(msgInfo.data[0]);
        break;
      }
      case GameSocketTopic.CLOSE_GAME:
        this.playerService.closeGame();
        break;
      default:
        break;
    }
  }
}
