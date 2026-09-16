// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { AuthService } from '../../../core/services/auth.service';
// import { NotificationService } from '../../../core/services/notification.service';

// @Component({
//   selector: 'app-navbar',
//   standalone: true,
//   imports: [CommonModule, RouterLink],
//   templateUrl: './navbar.component.html',
//   styleUrls: ['./navbar.component.css']
// })
// export class NavbarComponent implements OnInit {
//   unreadCount = 0;
//   userName = '';

//   constructor(
//     private authService: AuthService,
//     private notificationService: NotificationService,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     const user = this.authService.getCurrentUser();
//     if (user) this.userName = user.name;
//     this.loadUnreadCount();
//   }

//   loadUnreadCount(): void {
//     this.notificationService.getUnreadCount().subscribe({
//       next: (res) => {
//         this.unreadCount = res.count;
//         this.cdr.markForCheck();
//       }
//     });
//   }

//   logout(): void {
//     this.authService.logout();
//   }
// }
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { RequestService } from '../../../core/services/request.service';
import { SessionService } from '../../../core/services/session.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  unreadCount = 0;
  activeChatCount = 0;
  userName = '';

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private requestService: RequestService,
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.userName = user.name;
    this.loadUnreadCount();
    this.loadActiveChatCount();
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount = res.count;
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });
  }

  loadActiveChatCount(): void {
    const currentUserName = this.authService.getCurrentUser()?.name || '';
    this.activeChatCount = 0;

    this.requestService.getMyRequests().subscribe({
      next: (requests) => {
        const activeRequests = requests.filter(r => r.status === 'ACCEPTED').length;
        this.activeChatCount += activeRequests;
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });

    this.sessionService.getMySessions().subscribe({
      next: (sessions) => {
        const activeSessions = sessions.filter(s => s.status === 'BOOKED').length;
        this.activeChatCount += activeSessions;
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });

    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        const bookedByMe = sessions.filter(
          s => s.status === 'BOOKED' && s.bookedByName === currentUserName
        ).length;
        this.activeChatCount += bookedByMe;
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
