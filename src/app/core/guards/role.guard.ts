import { UserRoles } from '@/enums/user-roles.enum';
import { PlayerService } from '@/services/player.service';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const RoleGuard: CanActivateFn = () => {
  const playerService = inject(PlayerService);
  const router = inject(Router);

  const roles = playerService.playerData?.roles ?? [];

  if (roles.includes(UserRoles.PLAYER)) {
    return true;
  }

  if (roles.includes(UserRoles.MANAGER)) {
    setTimeout(() => {
      router.navigate(['/manager']);
    }, 300);
    return true;
  }

  if (roles.includes(UserRoles.WATCHER)) {
    setTimeout(() => {
      router.navigate(['/overlay']);
    }, 300);
    return true;
  }

  return false;
};
