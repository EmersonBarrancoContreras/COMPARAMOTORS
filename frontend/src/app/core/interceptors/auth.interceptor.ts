// auth.interceptor.ts
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

// Contador para prevenir bucles infinitos
let unauthorizedCount = 0;
const MAX_UNAUTHORIZED = 3;
let lastUnauthorizedTime = 0;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Resetear contador de errores si ha pasado suficiente tiempo
  const now = Date.now();
  if (now - lastUnauthorizedTime > 1000) {
    // 1 segundos
    unauthorizedCount = 0;
  }

  // Añadir token a la solicitud si existe y si no es una ruta pública
  const isPublicRoute =
    req.url.includes('/login') ||
    (req.url.includes('/users/register') && req.method === 'POST');

  if (!isPublicRoute) {
    const token = authService.getAccessToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }

  return next(req);
};
