import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { NotificationService } from '../../core/services/notification.service';
import { Notification } from '../../core/models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = false;

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
        this.cdr.markForCheck();
        this.notificationService.markAllAsRead().subscribe({
          next: () => this.cdr.markForCheck(),
          error: () => this.cdr.markForCheck()
        });
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
  getIcon(type: string): string {
  const icons: Record<string, string> = {
    'APPLICATION_RECEIVED': '🙋',
    'APPLICATION_ACCEPTED': '✅',
    'APPLICATION_REJECTED': '❌',
    'SESSION_BOOKED': '📅',
    'SESSION_CONFIRMED': '✅',
    'CREDITS_RECEIVED': '💰',
    'REQUEST_COMPLETED': '🎉',
    'SESSION_COMPLETED': '🎉'
  };
  return icons[type] || '🔔';
}
}
