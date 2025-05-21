// auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { environment } from '@environments/environments';
import { NotificationService } from './notification.service';

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  token: string;
  refreshToken?: string;
  user?: {
    id?: number;
    username?: string;
    email?: string;
    roles?: string[];
    rol?: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private messageService = inject(NotificationService);
  private apiUrl = environment.apiUrl;

  // Estado del usuario
  readonly authUser = signal<any>(null);
  readonly isLoading = signal(false);

  // Bandera para evitar múltiples intentos simultáneos
  private isLoggingIn = false;

  constructor() {
    this.checkLocalToken();
  }

  /**
   * Método para iniciar sesión - versión simplificada
   */
  async login(credentials: AuthCredentials): Promise<AuthTokens> {
    // Evitar múltiples peticiones simultáneas
    if (this.isLoggingIn) {
      console.warn('Ya hay un proceso de login en curso');
      throw new Error('Ya hay un proceso de login en curso');
    }

    try {
      this.isLoggingIn = true;
      this.isLoading.set(true);

      // Usar fetch en lugar de HttpClient para tener más control
      const response = await fetch(`${this.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: credentials.email,
          password: credentials.password,
        }),
      });

      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        let errorMsg = 'Error al iniciar sesión';

        if (response.status === 401) {
          errorMsg = 'Credenciales incorrectas';
        } else if (response.status === 500) {
          errorMsg = 'Error en el servidor';
        }

        throw new Error(errorMsg);
      }

      // Convertir respuesta a JSON
      const data = await response.json();

      if (data && data.token) {
        // Guardar tokens
        localStorage.setItem('token', data.token);
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken);
        }

        // Decodificar y establecer usuario
        this.setUserFromToken(data.token);

        return data;
      } else {
        throw new Error('Respuesta inválida del servidor');
      }
    } catch (error: any) {
      console.error('Error en el proceso de login:', error);
      this.messageService.error(error.message || 'Error al iniciar sesión');
      throw error;
    } finally {
      this.isLoggingIn = false;
      this.isLoading.set(false);
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  async logout(): Promise<void> {
    // Limpiar almacenamiento local
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('savedEmail');

    // Restablecer estado
    this.authUser.set(null);

    // Navegar a login
    try {
      await this.router.navigate(['/login']);
      this.messageService.info('Has cerrado sesión');
    } catch (error) {
      console.error('Error al redireccionar tras logout:', error);
    }
  }

  /**
   * Obtiene el token almacenado en localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Determina la ruta del dashboard según el rol
   */
  getDashboardRoute(role?: string): string {
    if (role === 'ADMIN') return '/admin/dashboard';
    if (role === 'USER') return '/user/dashboard';
    return '/landing';
  }

  /**
   * Gestiona el email guardado para recordar usuario
   */
  getStoredEmail(): string | null {
    return localStorage.getItem('savedEmail');
  }

  setStoredEmail(email: string): void {
    localStorage.setItem('savedEmail', email);
  }

  removeStoredEmail(): void {
    localStorage.removeItem('savedEmail');
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return Boolean(this.authUser());
  }

  /**
   * Verifica el token almacenado localmente
   */
  private checkLocalToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        this.setUserFromToken(token);
      } catch (error) {
        console.error('Error al verificar token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        this.authUser.set(null);
      }
    }
  }

  /**
   * Establece el usuario a partir del token decodificado
   */
  private setUserFromToken(token: string): void {
    try {
      const decoded = jwtDecode<any>(token);

      // Verificar expiración
      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate < new Date()) {
        throw new Error('Token expirado');
      }

      // Establecer usuario
      this.authUser.set(decoded);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      this.authUser.set(null);
      throw error;
    }
  }
}
