// auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environments';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // No procesar solicitudes a URLs externas o endpoints de autenticación
  if (!req.url.startsWith(environment.apiUrl) ||
      req.url.includes('/login') ||
      req.url.includes('/refresh-token')) {
    return next(req);
  }

  // Añadir token a la solicitud si existe
  const authReq = token ? addTokenToRequest(req, token) : req;

  // Procesar la solicitud y manejar errores 401 (token expirado)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si ocurre un error 401 (Unauthorized) y no estamos en una solicitud de refresh
      if (error.status === HttpStatusCode.Unauthorized) {
        return handleUnauthorizedError(authService, req, next);
      }

      return throwError(() => error);
    })
  );
};

/**
 * Función para añadir el token a la solicitud
 */
function addTokenToRequest(req: HttpRequest<any>, token: string): HttpRequest<any> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Maneja errores 401 intentando renovar el token
 */
function handleUnauthorizedError(
  authService: AuthService,
  req: HttpRequest<any>,
  next: (req: HttpRequest<any>) => Observable<any>
): Observable<any> {
  return authService.refreshToken().pipe(
    switchMap(newToken => {
      // Reintenta la solicitud original con el nuevo token
      return next(addTokenToRequest(req, newToken));
    }),
    catchError(refreshError => {
      // Si falla el refresh, enviamos al usuario al login
      authService.logout();
      return throwError(() => refreshError);
    })
  );
}
