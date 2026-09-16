import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { RequestService } from '../../core/services/request.service';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { HelpRequest } from '../../core/models/request.model';
import { Session } from '../../core/models/session.model';

@Component({
  selector: 'app-my-chats',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './my-chats.component.html',
  styleUrls: ['./my-chats.component.css']
})
export class MyChatsComponent implements OnInit {
  activeRequests: HelpRequest[] = [];
  activeSessions: Session[] = [];
  loading = true;
  currentUserName = '';

  constructor(
    private requestService: RequestService,
    private sessionService: SessionService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getCurrentUser()?.name || '';
    this.loadActiveChats();
  }

  loadActiveChats(): void {
    // load my requests where status is ACCEPTED
    this.requestService.getMyRequests().subscribe({
      next: (requests) => {
        this.activeRequests = requests.filter(r => r.status === 'ACCEPTED');
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });

    // load my sessions where status is BOOKED
    this.sessionService.getMySessions().subscribe({
      next: (sessions) => {
        this.activeSessions = sessions.filter(s => s.status === 'BOOKED');
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });

    // also load sessions where I am the student (bookedBy)
    this.sessionService.getAllSessions().subscribe({
      next: (sessions) => {
        const bookedByMe = sessions.filter(
          s => s.status === 'BOOKED' && s.bookedByName === this.currentUserName
        );
        // merge without duplicates
        bookedByMe.forEach(s => {
          if (!this.activeSessions.find(existing => existing.id === s.id)) {
            this.activeSessions.push(s);
          }
        });
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });
  }

  openRequestChat(req: HelpRequest): void {
    const chatWith = req.createdByName === this.currentUserName
      ? req.acceptedByName
      : req.createdByName;
    this.router.navigate(['/chat'], {
      queryParams: { type: 'request', id: req.id, with: chatWith }
    });
  }

  openSessionChat(session: Session): void {
    const chatWith = session.offeredByName === this.currentUserName
      ? session.bookedByName
      : session.offeredByName;
    this.router.navigate(['/chat'], {
      queryParams: { type: 'session', id: session.id, with: chatWith }
    });
  }

  get totalActiveChats(): number {
    return this.activeRequests.length + this.activeSessions.length;
  }
}
