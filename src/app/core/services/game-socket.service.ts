import { environment } from '@/assets/environments/environment.development';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Manager, Socket } from 'socket.io-client';
import { PlayerService } from './player.service';
import { GameSocketTopic } from '@/enums/game-topics.enum';
import { SocketResponse } from '@/interfaces/socket-response.interface';
import { LoaderService } from './loader.service';

@Injectable({providedIn: 'root'})
export class GameSocketService {

  private readonly playerService = inject(PlayerService);
  private readonly loadingService = inject(LoaderService);

  private socket: Socket | null = null;
  private socketNamespace: string = '/game';

  connect() {

    this.loadingService.addLoading();

    const manager = new Manager(`${environment.URL_WS}/socket.io/socket.io.js`, {
      extraHeaders : {
        authorization: this.playerService.jwtPlayer
      }
    });

    this.socket = manager.socket(this.socketNamespace);
    this.socket.on('connect', () => this.loadingService.finishLoading());
  }

  disconnect(){
    if(!this.socket){
      return;
    }

    this.socket.close();
    this.socket = null;
  }

  listen(eventName: string) {

    if(!this.socket){
      return;
    }

    return new Observable<SocketResponse>(observer => {
      this.socket!.on(eventName, data => {
        observer.next(JSON.parse(data));
      });
    });
  }

  emit(eventName: string, data: any) {

    if(!this.socket){
      return;
    }

    this.socket.emit(eventName, data);
  }

}
