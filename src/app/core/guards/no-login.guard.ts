import { PlayerService } from "@/services/player.service";
import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

export const NoLoggedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const playerService = inject(PlayerService);
  return (playerService.isLogged) ? false : true;
};
