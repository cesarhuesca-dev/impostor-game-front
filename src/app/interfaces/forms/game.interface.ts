export interface CreateGameInterface {
  roomName: string;
  roomPassword: string;
  players: number;
  customWords: boolean;
  category: boolean;
  specificCategory: string;
  canMultipleImpostors: boolean;
  availableOverlay: boolean;
}

export interface LoginGameInterface {
  roomName: string;
  roomPassword: string;
}
