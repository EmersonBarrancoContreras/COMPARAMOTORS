import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Limpiar cualquier estado de error de autenticación que pudiera causar loops
if (typeof localStorage !== 'undefined') {
  // Remover bandera de procesamiento de error de autenticación
  localStorage.removeItem('processing_auth_error');

  // Verificar si el token tiene formato válido para evitar bucles de autenticación
  const token = localStorage.getItem('token');
  if (token) {
    try {
      // Si el token no es un JWT válido, lo eliminamos
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3 || !tokenParts[1]) {
        console.warn('Se encontró un token inválido al iniciar, eliminando...');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
    } catch (e) {
      console.error('Error al verificar token en inicio:', e);
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
