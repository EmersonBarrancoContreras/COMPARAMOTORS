// login.component.ts
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

// PrimeNG Components
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    DividerModule,
    CheckboxModule,
    ToastModule,
    RippleModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export default class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    rememberMe: new FormControl(false),
  });

  loading = false;
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);
  ngOnInit() {
    // Si el usuario ya está autenticado, redirigirlo a la página principal
    if (this.authService.checkAuthenticated()) {
      this.router.navigate(['/landing']);
    }
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;

      // Extraer los valores del formulario
      const { email, password, rememberMe } = this.loginForm.value;

      // Llamar al servicio de autenticación
      this.authService.login(email!, password!).subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Inicio de sesión exitoso',
            detail: 'Bienvenido nuevamente!',
          });

          // Obtener la URL de retorno de los query params o usar la página principal
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/landing';
          setTimeout(() => this.router.navigate([returnUrl]), 1000);
        },
        error: (err) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: err.message || 'Credenciales incorrectas. Por favor intenta nuevamente.',
          });
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.loginForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario inválido',
        detail: 'Por favor completa todos los campos requeridos.',
      });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
