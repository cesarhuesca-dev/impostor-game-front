import { PlayerService } from "@/services/player.service";
import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";

export const NoLoggedGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const playerService = inject(PlayerService);
  const router = inject(Router);

  const logged = playerService.isLogged;

  if(logged){
    router.navigate(['/game']);
  }

  return (logged) ? false : true;
};
