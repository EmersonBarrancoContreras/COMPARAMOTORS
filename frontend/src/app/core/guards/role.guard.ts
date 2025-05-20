// role.guard.ts
import { inject, PLATFORM_ID, Inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

export const hasRole = (allowedRoles: string[]): CanActivateFn => {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const platformId = inject(PLATFORM_ID);
    const isBrowser = isPlatformBrowser(platformId);

    // Si no estamos en el navegador o no hay usuario autenticado
    if (!authService.checkAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    // Obtener el usuario actual del servicio de autenticación
    const user = authService.currentUser();
    if (!user || !user.roles) {
      return router.createUrlTree(['/login']);
    }

    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasRequiredRole = allowedRoles.some((role) =>
      user.roles?.some(r => r.name === role)
    );

    if (hasRequiredRole) {
      return true;
    }

    return router.createUrlTree(['/unauthorized']);
  };
};
