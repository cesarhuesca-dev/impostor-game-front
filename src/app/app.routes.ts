import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: 'home',
    loadComponent: () => import('@/pages/home/home.component')
  },
  {
    path: 'settings',
    loadComponent: () => import('@/pages/settings/settings.component')
  },
  {
    path: 'game',
    loadComponent: () => import('@/pages/game/game.component')
  },
  {
    path: 'manager',
    loadComponent: () => import('@/pages/manager/manager.component')
  },
  {
    path: 'create',
    loadComponent: () => import('@/pages/create/create.component')
  },
  {
    path: 'join',
    loadComponent: () => import('@/pages/join/join.component')
  },
  {
    path: '**',
    redirectTo: 'home'
  }

];
