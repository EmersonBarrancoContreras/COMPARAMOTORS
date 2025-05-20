// error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, retry } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    // Reintento para errores de red, 2 reintentos máximo
    retry({ count: 2, delay: 1000, resetOnSuccess: true }),
    catchError((error: HttpErrorResponse) => {
      // Para la ruta de login, no mostramos notificación aquí ya que se maneja en el servicio
      const isLoginRequest = req.url.includes('/login') && req.method === 'POST';

      if (error.status === 401 && !isLoginRequest) {
        // Token expirado o no válido (solo para otras rutas, no login)
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
        }
        notificationService.warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        router.navigate(['/login']);      }

      // Mensaje de error personalizado según el código de estado
      let errorMessage = 'Ha ocurrido un error desconocido';
      let errorType: 'error' | 'warning' | 'info' = 'error';

      if (error.error instanceof ErrorEvent) {
        // Error del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del servidor
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Solicitud incorrecta';
            errorType = 'warning';
            break;
          case 401:
            // Para 401 en solicitudes de login, personalizamos el mensaje
            if (isLoginRequest) {
              errorMessage = 'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
            } else {
              errorMessage = 'No autorizado. Tu sesión ha expirado.';
            }
            errorType = 'warning';
            break;
          case 403:
            errorMessage = 'No tienes permisos para acceder a este recurso';
            errorType = 'warning';
            break;
          case 404:
            errorMessage = 'El recurso solicitado no existe';
            errorType = 'info';
            break;
          case 500:
            errorMessage = 'Error en el servidor. Por favor, inténtalo más tarde';
            break;
          case 0:
            errorMessage = 'No se pudo conectar con el servidor. Comprueba tu conexión a internet';
            errorType = 'warning';
            break;
          default:
            errorMessage = `Error ${error.status}: ${
              error.error?.message || error.statusText
            }`;
        }
      }

      // Mostrar notificación al usuario
      notificationService.showNotification(errorType, errorMessage);

      // Log para depuración
      console.error('Error HTTP:', error);

      return throwError(() => new Error(errorMessage));
    })
  );
};
