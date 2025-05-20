// auth.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, switchMap, throwError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '@environments/environments';

// Variable para evitar ciclos infinitos de refresh token
let retryCount = 0;
const MAX_RETRIES = 3;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  // No procesar solicitudes a URLs externas o endpoints de autenticación
  // Comprobación más robusta para detectar las rutas de autenticación
  const isAuthEndpoint =
    req.url.includes('/login') ||
    req.url.includes('/refresh-token') ||
    req.url.endsWith('/api/login');

  // Añadir más logs para depuración
  console.log(`Interceptando petición a: ${req.url}, isAuthEndpoint: ${isAuthEndpoint}`);

  if (!req.url.startsWith(environment.apiUrl) || isAuthEndpoint) {
    console.log('Petición excluida del interceptor auth:', req.url);
    return next(req);
  }

  // Añadir token a la solicitud si existe
  const authReq = token ? addTokenToRequest(req, token) : req;

  // Procesar la solicitud y manejar errores 401 (token expirado)
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si ocurre un error 401 (Unauthorized) y no estamos en una solicitud de refresh
      if (error.status === HttpStatusCode.Unauthorized && retryCount < MAX_RETRIES) {
        return handleUnauthorizedError(authService, req, next);
      }

      // Si ya hemos intentado demasiadas veces o es otro tipo de error
      retryCount = 0; // Resetear contador para futuras peticiones
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
  retryCount++; // Incrementar contador para evitar ciclos infinitos
  console.log(`Intento #${retryCount} de renovar token para: ${req.url}`);

  return authService.refreshToken().pipe(
    switchMap(newToken => {
      // Reintenta la solicitud original con el nuevo token
      return next(addTokenToRequest(req, newToken));
    }),
    catchError(refreshError => {
      // Si falla el refresh, enviamos al usuario al login y evitamos reintentar
      console.error('Error al renovar token:', refreshError);
      authService.logout();
      return of({}); // Retornamos un observable vacío para evitar errores en cascada
    })
  );
}
