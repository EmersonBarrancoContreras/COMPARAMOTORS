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
    console.log('Iniciando proceso de registro...');
    console.log(
      'Estado del formulario:',
      this.registerForm.valid ? 'Válido' : 'Inválido'
    );    if (!this.registerForm.valid) {
      console.log('Errores del formulario:', this.registerForm.errors);
      console.log('Validación por campo:', {
        name: this.registerForm.get('name')?.errors,
        email: this.registerForm.get('email')?.errors,
        password: this.registerForm.get('password')?.errors,
        confirmPassword: this.registerForm.get('confirmPassword')?.errors,
        lastName: this.registerForm.get('lastName')?.errors,
        phoneNumber: this.registerForm.get('phoneNumber')?.errors,
        termsAccepted: this.registerForm.get('termsAccepted')?.errors,
      });
      return;
    }

    this.isLoading.set(true);
    console.log('Cargando establecido a: true');

    try {
      const formValues = this.registerForm.value;
      console.log('Valores del formulario:', formValues);

      // Asegurarse de que todos los campos sean correctos
      const registerData = {
        username: formValues.email ?? '', // Usando el email como username
        password: formValues.password ?? '',
        email: formValues.email ?? '',
        name: formValues.name ?? '',
        lastName: formValues.lastName ?? '',
        phoneNumber: Number(formValues.phoneNumber) ?? 0,
      };
      console.log('Datos de registro preparados:', registerData);

      console.log('Enviando solicitud de registro...');
      const response = await firstValueFrom(
        this.authService.register(registerData)
      );
      console.log('Respuesta del servidor:', response);

      console.log('Mostrando mensaje de éxito');
      this.messageService.add({
        severity: 'success',
        summary: '¡Registro exitoso!',
        detail: 'Tu cuenta ha sido creada correctamente',
      });

      console.log('Configurando redirección a login en 1.5 segundos');
      setTimeout(() => {
        console.log('Redirigiendo a /login');
        this.router.navigate(['/login']);
      }, 1500);
    } catch (error: any) {
      console.error('Error durante el registro:', error);
      console.log('Código de estado:', error.status);

      const detail =
        error.status === 409
          ? 'El correo electrónico ya está registrado.'
          : 'Error inesperado. Intenta nuevamente más tarde.';

      console.log('Mostrando mensaje de error:', detail);
      this.messageService.add({
        severity: 'error',
        summary: 'error',
        detail,
      });
    } finally {
      console.log('Finalizando proceso, cargando establecido a: false');
      this.isLoading.set(false);
    }
  }
}
