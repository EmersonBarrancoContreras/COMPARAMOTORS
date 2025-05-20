import { Component, OnInit, inject } from '@angular/core';
import {
  NotificationService,
  Notification,
} from '@services/notification.service';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, ToastModule],
  providers: [MessageService],
  template: `<p-toast></p-toast>`,
})
export class NotificationsComponent implements OnInit {
  private notificationService = inject(NotificationService);
  private messageService = inject(MessageService);

  ngOnInit(): void {
    this.notificationService.notifications$.subscribe(
      (notification: Notification) => {
        this.showToast(notification);
      }
    );
  }

  private showToast(notification: Notification): void {
    this.messageService.add({
      severity: notification.type,
      summary: this.getSummary(notification.type),
      detail: notification.message,
      life: notification.duration || 5000,
    });
  }

  private getSummary(type: string): string {
    switch (type) {
      case 'success':
        return '¡Éxito!';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return 'Notificación';
    }
  }
}
