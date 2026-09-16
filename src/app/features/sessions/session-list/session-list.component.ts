import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {
  allSessions: Session[] = [];
  mySessions: Session[] = [];
  activeTab: 'all' | 'mine' = 'all';
  loading = false;
  searchKeyword = '';

  constructor(
    private sessionService: SessionService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAllSessions();
    this.loadMySessions();
  }

  loadAllSessions(): void {
    this.loading = true;
    this.sessionService.getAllSessions().subscribe({
      next: (data) => {
        this.allSessions = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  loadMySessions(): void {
    this.sessionService.getMySessions().subscribe({
      next: (data) => {
        this.mySessions = data;
        this.cdr.markForCheck();
      },
      error: () => this.cdr.markForCheck()
    });
  }

  search(): void {
    this.loading = true;
    this.sessionService.getAllSessions(this.searchKeyword).subscribe({
      next: (data) => {
        this.allSessions = data;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
