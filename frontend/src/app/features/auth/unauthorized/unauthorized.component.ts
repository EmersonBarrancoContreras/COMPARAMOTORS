// unauthorized.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    RippleModule
  ],
  template: `
    <div class="unauthorized-container">
      <p-card styleClass="unauthorized-card">
        <ng-template pTemplate="header">
          <div class="icon-container">
            <i class="pi pi-lock text-6xl text-red-500"></i>
          </div>
        </ng-template>

        <h1 class="text-center text-4xl font-bold mb-4">Acceso No Autorizado</h1>
        <p class="text-center text-xl mb-6">
          No tienes permisos para acceder a esta página.
        </p>

        <div class="flex justify-content-center">
          <button
            pButton
            pRipple
            label="Volver al inicio"
            icon="pi pi-home"
            (click)="navigateToHome()"
            class="p-button-raised">
          </button>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
      padding: 2rem;
    }

    .unauthorized-card {
      max-width: 500px;
      width: 100%;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .icon-container {
      display: flex;
      justify-content: center;
      margin-bottom: 1rem;
      padding-top: 2rem;
    }
  `]
})
export default class UnauthorizedComponent {
  constructor(private router: Router) {}

  navigateToHome() {
    this.router.navigate(['/landing']);
  }
}
