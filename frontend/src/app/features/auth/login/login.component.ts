// login.component.ts
import { Component, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Services e interfaces
import {
  AuthService,
  AuthCredentials,
} from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    InputTextModule,
    PasswordModule,
    ToastModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [MessageService],
})
export default class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  isLoading = signal(false);
  loginAttempts = 0; // Contador de intentos para evitar bucles

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Verificar si ya hay un usuario autenticado
      const currentUser = this.authService.authUser();
      if (currentUser) {
        const dashboardRoute = this.authService.getDashboardRoute(
          currentUser.rol
        );
        void this.router.navigate([dashboardRoute]);
        return;
      }

      // Cargar email guardado
      const savedEmail = this.authService.getStoredEmail();
      if (savedEmail) {
        this.loginForm.patchValue({
          email: savedEmail,
          rememberMe: true,
        });
      }
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  async onSubmit() {
    // Validar formulario y estado de carga
    if (!this.loginForm.valid || this.isLoading()) {
      return;
    }

    // Verificar límite de intentos (medida anti-bucle)
    if (this.loginAttempts >= 3) {
      this.messageService.add({
        severity: 'error',
        summary: 'Demasiados intentos',
        detail:
          'Has excedido el número de intentos. Recarga la página para intentarlo de nuevo.',
      });
      return;
    }

    this.loginAttempts++;
    this.isLoading.set(true);
    this.loginForm.disable();

    try {
      const formValues = this.loginForm.value;
      const loginData: AuthCredentials = {
        email: formValues.email ?? '',
        password: formValues.password ?? '',
      };

      // Intentar login
      const response = await this.authService.login(loginData);

      // Manejar "recordarme"
      if (isPlatformBrowser(this.platformId)) {
        if (formValues.rememberMe) {
          this.authService.setStoredEmail(loginData.email);
        } else {
          this.authService.removeStoredEmail();
        }
      }

      // Mostrar mensaje de éxito
      this.messageService.add({
        severity: 'success',
        summary: '¡Bienvenido!',
        detail: 'Has iniciado sesión correctamente',
      });

      // Navegar al dashboard según rol
      const dashboardRoute = this.authService.getDashboardRoute(
        response.user?.rol
      );
      await this.router.navigate([dashboardRoute]);
    } catch (error: any) {
      console.error('Error en login:', error);

      // Mostrar mensaje de error
      this.messageService.add({
        severity: 'error',
        summary: 'Error de autenticación',
        detail: error.message || 'Error al iniciar sesión',
        life: 5000,
      });
    } finally {
      // Restablecer estado de la UI
      this.isLoading.set(false);
      this.loginForm.enable();
    }
  }

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
