import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { RequestService } from '../../../core/services/request.service';
import { AuthService } from '../../../core/services/auth.service';
import { HelpRequest, Application } from '../../../core/models/request.model';
import { HttpClient } from '@angular/common/http';

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
  loading = true;
  currentUserName = '';
  hasApplied = false;
  aiTip = '';

  constructor(
    private route: ActivatedRoute,
    private requestService: RequestService,
    private authService: AuthService,
    private router: Router,
    private http:HttpClient
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getCurrentUser()?.name || '';
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequest(id);
  }

  loadRequest(id: number): void {
    this.loading = true;
    this.requestService.getRequestById(id).subscribe({
      next: (request) => {
        this.request = request;
        this.loading = false;
        if (this.isCreator) {
          this.loadApplicants(id);
        }
      },
      error: () => this.loading = false
    });
    this.loadAiTip()
  }

  loadApplicants(id: number): void {
    this.requestService.getApplicants(id).subscribe({
      next: (data) => this.applicants = data
    });
  }

  get isCreator(): boolean {
    return this.request?.createdByName === this.currentUserName;
  }

  applyToRequest(): void {
    if (!this.applyMessage.trim()) {
      this.error = 'Please write a message';
      return;
    }
    this.requestService.applyToRequest(this.request!.id, this.applyMessage).subscribe({
      next: () => {
        this.success = 'Application sent!';
        this.hasApplied = true;
      },
      error: (err) => this.error = err.error?.message || 'Failed to apply'
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
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.error = err.error?.message || 'Failed to complete'
    });
  }

  cancelRequest(): void {
    this.requestService.cancelRequest(this.request!.id).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.error = err.error?.message || 'Failed to cancel'
    });
  }

  goToChat(): void {
    this.router.navigate(['/chat'], {
      queryParams: {
        type: 'request',
        id: this.request!.id,
        with: this.isCreator ? this.request!.acceptedByName : this.request!.createdByName
      }
    });
  }

  

loadAiTip(): void {
  if (!this.request) return;
  this.http.post<any>('http://localhost:8080/api/ai/match-helpers', {
    title: this.request.title,
    skillName: this.request.skillName
  }).subscribe({
    next: (res) => this.aiTip = res.tip,
    error: () => {}
  });
}
}