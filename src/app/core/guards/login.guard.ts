import { PlayerService } from '@/services/player.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const LoggedGuard: CanActivateFn = () => {
  const playerService = inject(PlayerService);
  const router = inject(Router);

  const logged = playerService.isLogged;

  if (!logged) {
    router.navigate(['/home']);
  }

  return logged ? true : false;
};
