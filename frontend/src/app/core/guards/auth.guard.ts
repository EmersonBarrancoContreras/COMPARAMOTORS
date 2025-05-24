// auth.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '@services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // Redirigir al login guardando la URL actual
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};
