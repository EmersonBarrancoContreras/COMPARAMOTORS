import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'landing',
    title: 'Inicio',
    loadComponent: () => import('./features/landing/landing.component'),
    children: [],
  },
  {
    path: 'news-infinite',
    title: 'Noticias',
    loadComponent: () =>
      import('@shared/components/news-infinite/news-infinite.component'),
    children: [],
  },
  {
    path: 'news',
    title: 'Noticias',
    loadComponent: () => import('@shared/components/news/news.component'),
  },
  /*redirección de la pagina por defecto en landing*/
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
];
