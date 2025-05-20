// auth.service.ts
import { Injectable, inject, signal, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  Observable,
  tap,
  catchError,
  throwError,
  BehaviorSubject,
  of,
  switchMap,
  take,
  finalize,
} from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { User } from '../models/user.model';
import { environment } from '@environments/environments';
import { NotificationService } from './notification.service';
import { isPlatformBrowser } from '@angular/common';

interface AuthTokens {
  token: string;
  refreshToken?: string;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private apiUrl = environment.apiUrl;
  private isBrowser: boolean;

  // Agregar un flag para controlar si hay un login en progreso
  private loginInProgress = false;

  // Añadir bandera para controlar redirecciones múltiples
  private redirectingToLogin = false;

  // Estado del usuario usando signals
  readonly currentUser = signal<User | null>(null);
  readonly authStatus = signal<boolean>(false);
  readonly isLoading = signal<boolean>(false);

  // Para control del refresh token
  private refreshTokenInProgress = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.checkToken();
    }
  }

  login(username: string, password: string): Observable<AuthTokens> {
    // Evitar múltiples peticiones simultáneas de login
    if (this.loginInProgress) {
      console.log('Login en progreso, evitando petición duplicada');
      return throwError(() => new Error('Login en progreso'));
    }

    this.loginInProgress = true;
    this.isLoading.set(true);

    // Log detallado de la petición para depuración
    console.log('Intentando login con email:', username);
    console.log('URL de la API:', `${this.apiUrl}/login`);

    // Crear el payload adaptado al backend (solo username y password)
    const loginPayload = {
      username: username,
      password: password,
    };

    return this.http
      .post<AuthTokens>(`${this.apiUrl}/login`, loginPayload)
      .pipe(
        // Operador take para completar después de un intento
        take(1),

        // Manejar respuesta exitosa
        tap((response) => {
          console.log('Login exitoso:', response);

          if (!response || !response.token) {
            throw new Error('Respuesta de autenticación inválida');
          }

          this.storeTokens(response);
          this.decodeAndSetUser(response.token);
        }),

        // Manejar errores
        catchError((error: HttpErrorResponse) => {
          console.error('Error en login:', error);

          let errorMsg = 'Error al iniciar sesión';

          if (error.status === 401) {
            errorMsg = 'Credenciales incorrectas';
            this.notificationService.error(errorMsg);
          } else if (error.status === 0) {
            errorMsg = 'No se pudo conectar con el servidor';
            this.notificationService.error(errorMsg);
          } else if (error.error?.message) {
            errorMsg = error.error.message;
            this.notificationService.error(errorMsg);
          }

          return throwError(() => new Error(errorMsg));
        }),

        // Siempre ejecutar al finalizar, tanto en éxito como en error
        finalize(() => {
          this.loginInProgress = false;
          this.isLoading.set(false);
        })
      );
  }

  refreshToken(): Observable<string> {
    // Evitar múltiples llamadas paralelas de refresh token
    if (this.refreshTokenInProgress) {
      return this.refreshTokenSubject.pipe(
        switchMap((token) => {
          if (token) {
            return of(token);
          }
          return throwError(() => new Error('Refresh token fallido'));
        })
      );
    }

    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      this.logoutWithoutRedirect();
      return throwError(() => new Error('Refresh token no disponible'));
    }

    this.refreshTokenInProgress = true;
    this.refreshTokenSubject.next(null);

    return this.http
      .post<AuthTokens>(`${this.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        switchMap((tokens: AuthTokens) => {
          this.refreshTokenInProgress = false;
          this.storeTokens(tokens);
          this.refreshTokenSubject.next(tokens.token);
          this.decodeAndSetUser(tokens.token);
          return of(tokens.token);
        }),
        catchError((error) => {
          this.refreshTokenInProgress = false;
          this.logoutWithoutRedirect();
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    // Evitar múltiples redirecciones al login
    if (this.redirectingToLogin) {
      console.log('Ya se está redireccionando al login, evitando redirección duplicada');
      return;
    }

    this.redirectingToLogin = true;

    // Remover tokens del almacenamiento
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }

    // Limpiar el estado del usuario
    this.currentUser.set(null);
    this.authStatus.set(false);

    // Redireccionar al login
    this.router.navigate(['/login']).then(() => {
      this.redirectingToLogin = false;
      this.notificationService.info('Has cerrado sesión');
    });
  }

  // Método para logout sin redirección (usado por refreshToken)
  private logoutWithoutRedirect(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }

    this.currentUser.set(null);
    this.authStatus.set(false);
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('refreshToken');
  }

  hasRole(role: string): boolean {
    const user = this.currentUser();
    if (!user || !user.roles) return false;

    return user.roles.some((r) => r.name === role);
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user || !user.roles) return false;

    return user.roles.some((role) =>
      role.permissions?.some((p) => p.name === permission)
    );
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.authStatus();
  }
  // Verifica si el usuario está autenticado (método para ser usado en guards y componentes)
  checkAuthenticated(): boolean {
    return Boolean(this.authStatus());
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Calcular tiempo hasta expiración (en segundos)
        const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

        // Si el token expira en menos de 5 minutos (300 segundos), intentar renovarlo
        if (expiresIn < 300) {
          this.refreshToken().subscribe({
            error: () => {
              // Si falla el refresh, limpiar datos pero NO redireccionar automáticamente
              this.logoutWithoutRedirect();
            }
          });
        } else {
          this.decodeAndSetUser(token);
        }
      } catch (error) {
        console.error('Error al verificar el token', error);
        // Si hay un refresh token, intentar renovar
        if (this.getRefreshToken()) {
          this.refreshToken().subscribe({
            error: () => this.logoutWithoutRedirect(), // Usamos logout sin redirección
          });
        } else {
          this.logoutWithoutRedirect(); // Usamos logout sin redirección
        }
      }
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    if (!this.isBrowser) return;

    if (tokens.token) {
      localStorage.setItem('token', tokens.token);
    }

    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
  }

  private decodeAndSetUser(token: string): void {
    try {
      const decoded: any = jwtDecode(token);

      // Verificar si el token ha expirado
      const expirationDate = new Date(decoded.exp * 1000);
      if (expirationDate < new Date()) {
        throw new Error('Token expirado');
      }

      // Crear objeto de usuario desde el token
      const user: User = {
        username: decoded.sub,
        email: decoded.email || '',
        roles:
          decoded.roles?.map((roleName: string) => ({ name: roleName })) || [],
      };

      this.currentUser.set(user);
      this.authStatus.set(true);
    } catch (error) {
      console.error('Error al decodificar el token', error);
      this.logoutWithoutRedirect(); // Usamos logout sin redirección
    }
  }
}
