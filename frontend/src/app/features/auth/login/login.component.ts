// login.component.ts
import { Component, inject, OnInit } from '@angular/core';
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
import { take } from 'rxjs';

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
export default class LoginComponent implements OnInit {
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

  // En login.component.ts
  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) {
      return;
    }

    // Obtener valores del formulario
    const { email, password } = this.loginForm.value;

    // Marcar como en proceso de envío
    this.loading = true;

    // Deshabilitar el formulario durante el envío
    this.loginForm.disable();

    // Hacer una sola petición
    this.authService.login(email!, password!).subscribe({
      next: () => {
        console.log('Login exitoso, redirigiendo...');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error de login en componente:', error);
        // El mensaje ya ha sido mostrado por el servicio
        this.loginForm.enable();
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
}
