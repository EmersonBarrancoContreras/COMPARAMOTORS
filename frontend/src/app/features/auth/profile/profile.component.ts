// profile.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    AvatarModule,
    TagModule
  ],
  template: `
    <div class="profile-container">
      <p-card styleClass="profile-card">
        <ng-template pTemplate="header">
          <div class="header-container">
            <h1 class="title">Mi Perfil</h1>
          </div>
        </ng-template>

        <div class="profile-content">
          <div class="avatar-section">
            <p-avatar
              icon="pi pi-user"
              size="xlarge"
              [style]="{ 'background-color': '#2196F3', color: '#ffffff' }"
              class="mr-2">
            </p-avatar>
            <h2>{{ user?.name || user?.username }}</h2>
          </div>

          <div class="info-section">
            <div class="info-row">
              <span class="info-label">Usuario:</span>
              <span class="info-value">{{ user?.username }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Correo:</span>
              <span class="info-value">{{ user?.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Roles:</span>
              <div class="roles-container">
                <p-tag
                  *ngFor="let role of user?.roles"
                  [value]="role.name"
                  [severity]="getRoleSeverity(role.name)">
                </p-tag>
              </div>
            </div>
          </div>

          <div class="actions-section">
            <button
              pButton
              label="Cerrar Sesión"
              icon="pi pi-sign-out"
              class="p-button-danger"
              (click)="logout()">
            </button>
          </div>
        </div>
      </p-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      padding: 2rem;
    }

    .profile-card {
      width: 100%;
      max-width: 600px;
    }

    .header-container {
      background-color: #f8f9fa;
      padding: 1rem;
      border-bottom: 1px solid #e9ecef;
    }

    .title {
      margin: 0;
      font-size: 1.5rem;
      color: #495057;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding: 1rem 0;
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-row {
      display: flex;
      gap: 1rem;
    }

    .info-label {
      font-weight: bold;
      min-width: 80px;
    }

    .roles-container {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .actions-section {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
    }
  `]
})
export default class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  user: User | null = null;

  ngOnInit() {
    this.user = this.authService.currentUser();
    if (!this.user) {
      this.router.navigate(['/login']);
    }
  }

  getRoleSeverity(roleName: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    const severityMap: {[key: string]: 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast'} = {
      'ADMIN': 'danger',
      'EDITOR': 'warn',
      'USER': 'info'
    };

    return severityMap[roleName] || 'info';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
