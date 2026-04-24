import { Player } from './player.interface';

export interface Game {
  //Propiedades que viene de back
  id: string;
  roomName: string;
  roomPassword?: string;
  roomPlayers: number;
  customWords: boolean;
  specificCategory: boolean;
  category: string;
  multipleImpostors: boolean;
  overlay: boolean;
  gameStarted: boolean;
  roomPlayersJoined: number;
  round: number;
  starterRoundPlayer: string | null;
  word: string | null;
  players?: Player[];
}
