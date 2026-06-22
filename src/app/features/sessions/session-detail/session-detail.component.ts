import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../../core/services/auth.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.css']
})
export class SessionDetailComponent implements OnInit {
  session: Session | null = null;
  error = '';
  success = '';
  loading = false;
  booking = false;
  scheduledTime = '';
  currentUserName = '';
  

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getCurrentUser()?.name || '';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSession(id);
  }

  loadSession(id: number): void {
  this.loading = true;
  this.sessionService.getSessionById(id).subscribe({
    next: (session) => {
      this.session = session;
      this.loading = false;
    },
    error: () => this.loading = false
  });
}

  // ⭐ Key check — hide book button if it's your own session
  get isOwner(): boolean {
    return this.session?.offeredByName === this.currentUserName;
  }

  get isBooked(): boolean {
    return this.session?.status === 'BOOKED';
  }

  get isCompleted(): boolean {
    return this.session?.status === 'COMPLETED';
  }

  bookSession(): void {
    if (!this.session) return;
    this.booking = true;
    this.sessionService.requestBooking(this.session.id).subscribe({
      next: () => {
        this.success = 'Booking request sent! Wait for the poster to confirm.';
        this.booking = false;
        this.loadSession(this.session!.id);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to book session';
        this.booking = false;
      }
    });
  }

  confirmBooking(): void {
    if (!this.scheduledTime) {
      this.error = 'Please select a date and time';
      return;
    }
    this.loading = true;
    // convert datetime-local format to ISO string
    const isoTime = new Date(this.scheduledTime).toISOString().slice(0, 19);
    this.sessionService.confirmBooking(this.session!.id, isoTime).subscribe({
      next: () => {
        this.success = 'Booking confirmed! Chat is now open.';
        this.loading = false;
        this.loadSession(this.session!.id);
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to confirm booking';
        this.loading = false;
      }
    });
  }

  completeSession(): void {
    this.sessionService.completeSession(this.session!.id).subscribe({
      next: () => {
        this.success = 'Session completed! Credits transferred.';
        setTimeout(() => this.router.navigate(['/dashboard']), 1500);
      },
      error: (err) => this.error = err.error?.message || 'Failed to complete'
    });
  }

  goToChat(): void {
    this.router.navigate(['/chat'], {
      queryParams: {
        type: 'session',
        id: this.session!.id,
        with: this.isOwner ? this.session!.bookedByName : this.session!.offeredByName
      }
    });
  }

  getMeetLink(): string {
    // generate a deterministic meet link based on session id
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const seed = this.session!.id;
    const part1 = chars.slice(seed % 20, (seed % 20) + 3);
    const part2 = chars.slice((seed * 3) % 20, ((seed * 3) % 20) + 4);
    const part3 = chars.slice((seed * 7) % 20, ((seed * 7) % 20) + 3);
    return `https://meet.google.com/${part1}-${part2}-${part3}`;
  }

  get isStudentBooked(): boolean {
  return this.session?.bookedByName === this.currentUserName;
}
}