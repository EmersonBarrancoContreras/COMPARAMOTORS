// error.interceptor.ts
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    // Reintento para errores de red, 2 reintentos máximo

    catchError((error: HttpErrorResponse) => {
      console.log('Error interceptado:', error.status, req.url); // Para la ruta de login, tratamos los errores de manera diferente
      const isLoginRequest =
        req.url.includes('/login') && req.method === 'POST';
      console.log(
        'ErrorInterceptor - URL:',
        req.url,
        'Status:',
        error.status,
        'isLoginRequest:',
        isLoginRequest
      );

      // Evitar redireccionar a login si ya estamos procesando un error de autenticación
      const isProcessing401 = localStorage.getItem('processing_auth_error');

      if (error.status === 401 && !isLoginRequest && !isProcessing401) {
        // Establecer flag para evitar múltiples redirecciones
        localStorage.setItem('processing_auth_error', 'true');

        // Token expirado o no válido (solo para otras rutas, no login)
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('token');
        }

        notificationService.warning(
          'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
        );

        // Navegar al login y limpiar el flag cuando termine la navegación
        router.navigate(['/login']).then(() => {
          localStorage.removeItem('processing_auth_error');
        });
      }

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
              errorMessage =
                'Credenciales incorrectas. Por favor, verifica tu usuario y contraseña.';
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
            errorMessage =
              'Error en el servidor. Por favor, inténtalo más tarde';
            break;
          case 0:
            errorMessage =
              'No se pudo conectar con el servidor. Comprueba tu conexión a internet';
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
