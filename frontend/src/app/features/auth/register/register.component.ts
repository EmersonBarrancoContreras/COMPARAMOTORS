// register.component.ts
import { Component, OnInit, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
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
import { AuthService } from '@services/auth.service';
import { firstValueFrom } from 'rxjs';

// Validator para comparar contraseñas
export const passwordMatchValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { passwordMismatch: true }
    : null;
};

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService],
})
export default class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private readonly platformId = inject(PLATFORM_ID);

  isLoading = signal(false);

  registerForm = this.fb.group(
    {
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      termsAccepted: [false, [Validators.requiredTrue]],
    },
    { validators: passwordMatchValidator }
  );

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentUser = this.authService.getUserData();
      if (currentUser) {
        this.router.navigate(['/']);
      }
    }
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);

      try {
        const formValues = this.registerForm.value;
        const registerData = {
          username: formValues.name ?? '',
          password: formValues.password ?? '',
          email: formValues.email ?? '',
          name: formValues.name ?? '',
          lastName: formValues.lastName ?? '',
          phoneNumber: Number(formValues.phoneNumber) ?? 0,
        };

        const response = await firstValueFrom(
          this.authService.register(registerData)
        );

        this.messageService.add({
          severity: 'success',
          summary: '¡Registro exitoso!',
          detail: 'Tu cuenta ha sido creada correctamente',
        });

        // Redireccionar al login después del registro exitoso
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      } catch (error: any) {
        const detail =
          error.status === 409
            ? 'El correo electrónico ya está registrado.'
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
}
