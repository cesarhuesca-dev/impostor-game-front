import { PlayerService } from '@/services/player.service';
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

export const LoggedGuard: CanActivateFn = () => {
  const playerService = inject(PlayerService);

  const logged = playerService.isLogged;

  if (!logged) {
    playerService.navigateByRole();
  }

  return logged ? true : false;
};
