// cache.interceptor.ts
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '../services/cache.service';

// Rutas que deben ser excluidas del caché
const EXCLUDED_ROUTES = [
  '/login',
  '/logout',
  '/refresh-token'
];

export const cacheInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Solo cachear solicitudes GET
  if (req.method !== 'GET') {
    return next(req);
  }

  // No cachear rutas excluidas
  if (EXCLUDED_ROUTES.some(route => req.url.includes(route))) {
    return next(req);
  }

  const cacheService = inject(CacheService);
  const cacheKey = generateCacheKey(req);

  return cacheService.getOrRetrieve(
    cacheKey,
    () => cacheRequest(req, next),
    10 * 60 * 1000 // Caché de 10 minutos para llamadas GET
  );
};

/**
 * Genera una clave única para la solicitud HTTP basada en la URL y los parámetros
 */
function generateCacheKey(req: HttpRequest<unknown>): string {
  return `${req.urlWithParams}`;
}

/**
 * Ejecuta la solicitud HTTP y prepara la respuesta para ser cacheada
 */
function cacheRequest(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> {
  return next(req).pipe(
    tap(event => {
      // Solo cachear respuestas completas HTTP
      if (!(event instanceof HttpResponse)) {
        return;
      }
    })
  );
}
