import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RequestService } from '../../core/services/request.service';
import { SessionService } from '../../core/services/session.service';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest } from '../../core/models/request.model';
import { Session } from '../../core/models/session.model';
import { User } from '../../core/models/user.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  requests: HelpRequest[] = [];
  sessions: Session[] = [];
  user: User | null = null;
  activeTab: 'requests' | 'sessions' = 'requests';
  searchKeyword = '';
  selectedCategory = '';
  loading = false;

  categories = ['All', 'Programming', 'AI/ML', 'Career', 'Design', 'Academics', 'General'];

  constructor(
    private requestService: RequestService,
    private sessionService: SessionService,
    private userService: UserService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
    this.loadRequests();
    this.loadSessions();
  }

  loadProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        this.cdr.markForCheck();
      },
    });
  }

  loadRequests(): void {
    this.loading = true;
    const category = this.selectedCategory === 'All' ? '' : this.selectedCategory;
    this.requestService
      .getAllOpenRequests(this.searchKeyword || undefined, category || undefined)
      .subscribe({
        next: (data) => {
          this.requests = data;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  loadSessions(): void {
    this.sessionService.getAllSessions(this.searchKeyword || undefined).subscribe({
      next: (data) => {
        this.sessions = data;
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck(),
    });
  }

  search(): void {
    this.loadRequests();
    this.loadSessions();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.loadRequests();
  }

  get currentUserName(): string {
    return this.authService.getCurrentUser()?.name || '';
  }
}
