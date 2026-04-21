import { environment } from '@/assets/environments/environment';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Manager, Socket } from 'socket.io-client';
import { GameSocketTopic } from '@/enums/game-topics.enum';
import { SocketResponse } from '@/interfaces/response/socket-response.interface';
import { LoaderService } from '../loader.service';
import { GameSocketHandlerService } from './game-socket-handler.service';

@Injectable({ providedIn: 'root' })
export class GameSocketService {
  private readonly gameSocketHandlerService = inject(GameSocketHandlerService);
  private readonly loadingService = inject(LoaderService);

  private socket: Socket | null = null;
  private readonly socketNamespace = '/game';

  connect(tokenPlayer: string) {
    if (this.socket?.connected) {
      return;
    }

    this.loadingService.addLoading();
    const manager = new Manager(`${environment.URL_WS}/socket.io/socket.io.js`, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      extraHeaders: {
        authorization: tokenPlayer,
      },
    });
    this.socket = manager.socket(this.socketNamespace);
    this.socket.on('connect', () => this.loadingService.finishLoading());
    this.listen(GameSocketTopic.PLAYER_MESSAGE)?.subscribe((msg) => this.gameSocketHandlerService.handleMessage(msg));
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
}
