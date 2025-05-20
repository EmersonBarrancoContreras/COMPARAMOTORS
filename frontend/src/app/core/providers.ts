// providers.ts - Proveedores para la aplicación Angular 19
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptors/auth.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { cacheInterceptor } from './interceptors/cache.interceptor';

/**
 * Proveedores para el módulo HTTP con interceptores configurados
 * Para usar en proveedores de aplicación (app.config.ts)
 */
export const provideHttpWithInterceptors = () => {
  return provideHttpClient(
    withInterceptors([
      // Orden importante de los interceptores
      cacheInterceptor, // Primero cache para evitar llamadas innecesarias
      authInterceptor,  // Después auth para añadir token
      errorInterceptor, // Por último error para capturar cualquier error
    ])
  );
};
