import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    title: 'Inicio',
    loadComponent: () => import('./features/landing/landing.component'),
    children: [
      {
        path: 'header',
        loadComponent: () => import('./features/landing/components/header/header.component'),
      },
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing'
  }
];
