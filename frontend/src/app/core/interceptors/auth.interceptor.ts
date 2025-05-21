// auth.interceptor.ts
import { HttpInterceptorFn, HttpRequest, HttpStatusCode, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environments';

// Contador para prevenir bucles infinitos
let unauthorizedCount = 0;
const MAX_UNAUTHORIZED = 3;
let lastUnauthorizedTime = 0;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // IMPORTANTE: Excluir rutas de autenticación para evitar bucles
  if (req.url.includes('/login') ||
      req.url.includes('/refresh-token') ||
      !req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  // Resetear contador de errores si ha pasado suficiente tiempo
  const now = Date.now();
  if (now - lastUnauthorizedTime > 10000) { // 10 segundos
    unauthorizedCount = 0;
  }

  // Añadir token a la solicitud si existe
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Manejar error 401 (Unauthorized)
      if (error.status === HttpStatusCode.Unauthorized) {
        unauthorizedCount++;
        lastUnauthorizedTime = Date.now();

        console.warn(`Error de autorización #${unauthorizedCount}`);

        // Prevenir bucles redirigiendo solo hasta cierto límite
        if (unauthorizedCount < MAX_UNAUTHORIZED) {
          // Usar setTimeout para evitar bloquear el hilo principal
          setTimeout(() => {
            authService.logout();
          }, 100);
        } else {
          console.error('Demasiados errores de autorización, evitando redirección');
        }
      }

      return throwError(() => error);
    })
  );
};
