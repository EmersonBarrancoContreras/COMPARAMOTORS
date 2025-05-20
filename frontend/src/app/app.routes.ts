import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
  {
    path: 'login',
    title: 'Iniciar sesión',
    loadComponent: () => import('./features/auth/login/login.component'),
  },
  {
    path: 'register',
    title: 'Registro',
    loadComponent: () => import('./features/auth/register/register.component'),
  },
  {
    path: 'profile',
    title: 'Mi Perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/profile/profile.component'),
  },
  {
    path: 'unauthorized',
    title: 'Acceso No Autorizado',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component'),
  },
  /*redirección de la pagina por defecto en landing*/
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'landing',
  },
];
