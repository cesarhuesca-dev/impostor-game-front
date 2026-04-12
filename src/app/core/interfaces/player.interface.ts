import { Game } from './game.interface';

export interface Player {
  id: string;
  name: string;
  avatarImg: boolean;
  host: boolean;
  impostor: boolean;

  game: Game;
}
