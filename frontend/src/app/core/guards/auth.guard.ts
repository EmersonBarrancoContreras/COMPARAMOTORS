// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.checkAuthenticated()) {
    return true;
  }

  // Redirigir a la página de login, guardando la URL actual para redirigir después
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
