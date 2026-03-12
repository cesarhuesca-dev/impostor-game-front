import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () => import('@/pages/user/home/home.component')
  },
  {
    path: 'create',
    loadComponent: () => import('@/pages/user/create/create.component')
  },
  {
    path: 'join',
    loadComponent: () => import('@/pages/user/join/join.component')
  },
  {
    path: 'settings',
    loadComponent: () => import('@/pages/settings/settings.component')
  },
  {
    path: 'game',
    loadComponent: () => import('@/pages/game/game/game.component')
  },
  {
    path: 'manager',
    loadComponent: () => import('@/pages/game/manager/manager.component')
  },
  {
    path: 'overlay',
    loadComponent: () => import('@/pages/game/overlay/overlay.component')
  },
  {
    path: '**',
    redirectTo: 'home'
  }

];
