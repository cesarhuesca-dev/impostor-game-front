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
  word: string | null;
  players?: Player[];
}

export interface Player {
  id: string;
  name: string;
  avatarImg: boolean;
  host: boolean;
  impostor: boolean;

  game: Game;
}
