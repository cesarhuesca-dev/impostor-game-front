export interface CreateGameInterface {
  roomName: string;
  roomPassword: string;
  roomPlayers: number;
  customWords: boolean;
  specificCategory: boolean;
  category: string;
  multipleImpostors: boolean;
  overlay: boolean;
}

export interface LoginGameInterface {
  roomName: string;
  roomPassword: string;
  playerName? : string
}
