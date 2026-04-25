import { UserRoles } from '@/enums/user-roles.enum';
import { Game } from './game.interface';

export interface Player {
  id: string;
  name: string;
  avatarImg: boolean;
  host: boolean;
  impostor: boolean;
  roles: UserRoles[];
  createdAt: number;
  updatedAt: number;
  game: Game;
}
