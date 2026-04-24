import { inject, Injectable } from '@angular/core';
import { PlayerService } from '../player.service';
import { GameSocketTopic } from '@/enums/game-topics.enum';
import { SocketResponse } from '@/interfaces/response/socket-response.interface';
import { GameService } from '../game.service';
import { Game } from '@/interfaces/game.interface';
import { Player } from '@/interfaces/player.interface';
import { RoundService } from '../round.service';
import { CloseGameService } from '../close-game.service';

@Injectable({ providedIn: 'root' })
export class GameSocketHandlerService {
  private readonly playerService = inject(PlayerService);
  private readonly gameService = inject(GameService);
  private readonly roundService = inject(RoundService);
  private readonly closeGameService = inject(CloseGameService);

  handleMessage(msg: SocketResponse<unknown>) {
    if (!msg.success) {
      return;
    }

    switch (msg.topic) {
      case GameSocketTopic.NEW_ROUND_GAME: {
        const msgInfo = msg as SocketResponse<Game>;
        this.gameService.setGameData(msgInfo.data[0]);
        this.roundService.startCountdown();
        break;
      }
      case GameSocketTopic.UPDATE_GAME_STATUS: {
        const msgInfo = msg as SocketResponse<Game>;
        this.gameService.setGameData(msgInfo.data[0]);
        break;
      }
      case GameSocketTopic.UPDATE_PLAYER_STATUS: {
        const msgInfo = msg as SocketResponse<Player>;
        this.playerService.setPlayerData(msgInfo.data[0]);
        break;
      }
      case GameSocketTopic.PLAYER_ELIMINATED: {
        const msgInfo = msg as SocketResponse<string>;
        this.playerService.checkBanPlayer(msgInfo.data[0]);
        break;
      }
      case GameSocketTopic.CLOSE_GAME:
        this.closeGameService.startClosedGame();
        break;
      default:
        break;
    }
  }
}
