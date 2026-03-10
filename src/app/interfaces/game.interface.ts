
export interface Game {
  word: WordGame;
  players: Player[];
  round: number;
  isShowingWord: boolean;
  isShowingImpostor: boolean;
  isGameStarted: boolean;
}

export interface Player {
  id: number;
  name: string;
  img: string;
  impostor:boolean;
}

export interface WordGame {
  category?:string;
  word: string;
}

