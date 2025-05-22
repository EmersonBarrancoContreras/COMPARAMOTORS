// login.component.ts
import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
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
import { AuthService, AuthCredentials } from '@services/auth.service';
import { firstValueFrom } from 'rxjs';
import { log } from 'console';

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
export default class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private readonly platformId = inject(PLATFORM_ID);

  isLoading = signal(false);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currenUser = this.authService.getUserData();
      if (currenUser) {
        this.router.navigate(['/']);
      }
    }

    //cargar email guardado si existe

    const savedEmail = this.authService.getSavedEmail();
    if (savedEmail) {
      this.loginForm.patchValue({
        email: savedEmail,
        rememberMe: true,
      });
    }
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);

      try {
        const formValues = this.loginForm.value;
        const loginData: AuthCredentials = {
          username: formValues.email ?? '',
          password: formValues.password ?? '',
        };

        const response = await firstValueFrom(
          this.authService.login(loginData)
        );

        if (isPlatformBrowser(this.platformId)) {
          if (formValues.rememberMe) {
            this.authService.saveEmail(loginData.username);
          } else {
            this.authService.removeSavedEmail();
          }
        }
        this.messageService.add({
          severity: 'success',
          summary: '¡Bienvenido!',
          detail: 'Has iniciado sesión correctamente',
        });

        const returnUrl =
          this.router.getCurrentNavigation()?.extractedUrl.queryParams[
            'returnUrl'
          ] || '/login';

        // Navegar a la URL de retorno o a /profile por defecto
        this.router.navigate([returnUrl]);
      } catch (error: any) {
        const detail =
          error.status === 401
            ? 'Credenciales inválidas. Por favor, verifica tus datos.'
            : 'Error inesperado. Intenta nuevamente más tarde.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail,
        });
      } finally {
        this.isLoading.set(false);
      }
    }
  }

  navigateTo(path: string): void {
    void this.router.navigate([path]);
  }
}
