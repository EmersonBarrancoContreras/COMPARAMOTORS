import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    title: 'Inicio',
    loadComponent: () => import('./features/landing/landing.component'),
    children: [],
  },
  /*redirección de la pagina por defecto en landing*/
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
];
