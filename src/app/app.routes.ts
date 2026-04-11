import { Routes } from '@angular/router';
import { NoLoggedGuard } from 'src/app/core/guards/no-login.guard';
import { LoggedGuard } from 'src/app/core/guards/login.guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('@/pages/user/home/home.component'),
    canActivate: [NoLoggedGuard],
  },
  {
    path: 'create',
    loadComponent: () => import('@/pages/user/create/create.component'),
    canActivate: [NoLoggedGuard],
  },
  {
    path: 'join',
    loadComponent: () => import('@/pages/user/join/join.component'),
    canActivate: [NoLoggedGuard],
  },
  {
    path: 'game',
    loadComponent: () => import('@/pages/game/game/game.component'),
    canActivate: [LoggedGuard],
  },
  {
    path: 'manager',
    loadComponent: () => import('@/pages/game/manager/manager.component'),
    canActivate: [LoggedGuard],
  },
  {
    path: 'overlay',
    loadComponent: () => import('@/pages/game/overlay/overlay.component'),
    canActivate: [LoggedGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('@/pages/settings/settings.component'),
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
