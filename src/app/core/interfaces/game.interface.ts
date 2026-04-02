
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
  showingImpostor: boolean;
  showingWord: boolean;
  roomPlayersJoined: number;
  round: number;

  players?: Player[];

  //Propiedades que faltan por mapear o quitar
  word: WordGame;

}

export interface Player {
  id: string;
  name: string;
  avatarImg: boolean;
  host: boolean;

  game: Game

  impostor:boolean; //FALTA BACK
  img: string; //MAPEAR EN BACK O TRASNFORMAR EN FRONT
}

export interface WordGame {
  category?:string;
  word: string;
}

