// notification.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubject = new Subject<Notification>();
  notifications$ = this.notificationSubject.asObservable();

  constructor() { }

  showNotification(type: NotificationType, message: string, duration: number = 5000): void {
    this.notificationSubject.next({
      type,
      message,
      duration
    });
  }

  success(message: string, duration?: number): void {
    this.showNotification('success', message, duration);
  }

  error(message: string, duration?: number): void {
    this.showNotification('error', message, duration);
  }

  info(message: string, duration?: number): void {
    this.showNotification('info', message, duration);
  }

  warning(message: string, duration?: number): void {
    this.showNotification('warning', message, duration);
  }
}
