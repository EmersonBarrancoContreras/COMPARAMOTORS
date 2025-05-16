// login.component.ts
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

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

  constructor(private router: Router, private messageService: MessageService) {}

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;

      // Extraer los valores del formulario
      const { email, password, rememberMe } = this.loginForm.value;

      // Llamar al servicio de autenticación (implementación ficticia)
      // this.authService.login(email!, password!, rememberMe!).subscribe({
      //   next: () => {
      //     this.messageService.add({
      //       severity: 'success',
      //       summary: 'Inicio de sesión exitoso',
      //       detail: 'Bienvenido nuevamente!',
      //     });
      //     setTimeout(() => this.router.navigate(['/dashboard']), 1000);
      //   },
      //   error: (err) => {
      //     this.loading = false;
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail: 'Credenciales incorrectas. Por favor intenta nuevamente.',
      //     });
      //   },
      // });
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
