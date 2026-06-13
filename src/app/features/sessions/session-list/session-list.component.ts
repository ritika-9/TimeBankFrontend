import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { SessionService } from '../../../core/services/session.service';
import { Session } from '../../../core/models/session.model';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.css']
})
export class SessionListComponent implements OnInit {
  mySessions: Session[] = [];
  loading = false;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.loading = true;
    this.sessionService.getAllSessions().subscribe({
      next: (data) => { this.mySessions = data; this.loading = false; },
      error: () => this.loading = false
    });
  }
}