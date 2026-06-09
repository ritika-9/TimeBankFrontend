import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  unreadCount = 0;
  userName = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.userName = user.name;
    this.loadUnreadCount();
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount = res.count
    });
  }

  logout(): void {
    this.authService.logout();
  }
}