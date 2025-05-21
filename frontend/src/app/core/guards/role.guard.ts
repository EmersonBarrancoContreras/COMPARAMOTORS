// role.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const hasRole = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    // Verificar si el usuario está autenticado
    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const currentUser = authService.authUser();
    if (currentUser && currentUser.roles) {
      const userRoles = Array.isArray(currentUser.roles)
        ? currentUser.roles
        : [currentUser.rol].filter(Boolean);

      if (userRoles.some((role: string) => allowedRoles.includes(role))) {
        return true;
      }
    }

    return router.createUrlTree(['/unauthorized']);
  };
};
