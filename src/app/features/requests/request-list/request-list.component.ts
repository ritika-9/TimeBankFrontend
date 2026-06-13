import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RequestService } from '../../../core/services/request.service';
import { HelpRequest } from '../../../core/models/request.model';

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, NavbarComponent],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.css']
})
export class RequestListComponent implements OnInit {
  myRequests: HelpRequest[] = [];
  loading = false;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loading = true;
    this.requestService.getMyRequests().subscribe({
      next: (data) => { this.myRequests = data; this.loading = false; },
      error: () => this.loading = false
    });
  }

  getStatusClass(status: string): string {
    return 'badge-' + status.toLowerCase();
  }
}