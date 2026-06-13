import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';
import { HelpRequest, Application } from '../../../core/models/request.model';

@Component({
  selector: 'app-request-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit {
  request: HelpRequest | null = null;
  applicants: Application[] = [];
  applyMessage = '';
  error = '';
  success = '';
  loading = false;
  currentUserEmail = '';
  hasApplied = false;

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUserEmail = this.authService.getCurrentUser()?.email || '';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest(id);
  }

  loadRequest(id: number): void {
    this.requestService.getAllOpenRequests().subscribe({
      next: (requests) => {
        this.request = requests.find(r => r.id === id) || null;
        if (this.request && this.isCreator) {
          this.loadApplicants(id);
        }
      }
    });
  }

  loadApplicants(id: number): void {
    this.requestService.getApplicants(id).subscribe({
      next: (data) => this.applicants = data
    });
  }

  get isCreator(): boolean {
    return this.request?.createdByName === this.authService.getCurrentUser()?.name;
  }

  applyToRequest(): void {
    if (!this.applyMessage.trim()) {
      this.error = 'Please write a message';
      return;
    }
    this.loading = true;
    this.requestService.applyToRequest(this.request!.id, this.applyMessage).subscribe({
      next: () => {
        this.success = 'Application sent successfully!';
        this.hasApplied = true;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to apply';
        this.loading = false;
      }
    });
  }

  acceptApplicant(applicantId: number): void {
    this.requestService.acceptApplicant(this.request!.id, applicantId).subscribe({
      next: () => {
        this.success = 'Applicant accepted! Chat is now open.';
        this.loadRequest(this.request!.id);
      },
      error: (err) => this.error = err.error?.message || 'Failed to accept'
    });
  }

  completeRequest(): void {
    this.requestService.completeRequest(this.request!.id).subscribe({
      next: () => {
        this.success = 'Request completed! Credits transferred.';
        this.router.navigate(['/dashboard']);
      },
      error: (err) => this.error = err.error?.message || 'Failed to complete'
    });
  }

  cancelRequest(): void {
    this.requestService.cancelRequest(this.request!.id).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.error = err.error?.message || 'Failed to cancel'
    });
  }
}