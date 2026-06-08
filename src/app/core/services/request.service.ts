import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HelpRequest, CreateHelpRequest, Application } from '../models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  private apiUrl = 'http://localhost:8080/api/requests';

  constructor(private http: HttpClient) {}

  getAllOpenRequests(keyword?: string, category?: string): Observable<HelpRequest[]> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    if (category) params = params.set('category', category);
    return this.http.get<HelpRequest[]>(this.apiUrl, { params });
  }

  getMyRequests(): Observable<HelpRequest[]> {
    return this.http.get<HelpRequest[]>(`${this.apiUrl}/my`);
  }

  createRequest(request: CreateHelpRequest): Observable<HelpRequest> {
    return this.http.post<HelpRequest>(this.apiUrl, request);
  }

  applyToRequest(requestId: number, message: string): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/${requestId}/apply`, { message });
  }

  getApplicants(requestId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/${requestId}/applicants`);
  }

  acceptApplicant(requestId: number, applicantId: number): Observable<HelpRequest> {
    return this.http.put<HelpRequest>(
      `${this.apiUrl}/${requestId}/accept/${applicantId}`, {});
  }

  completeRequest(requestId: number): Observable<HelpRequest> {
    return this.http.put<HelpRequest>(`${this.apiUrl}/${requestId}/complete`, {});
  }

  cancelRequest(requestId: number): Observable<HelpRequest> {
    return this.http.put<HelpRequest>(`${this.apiUrl}/${requestId}/cancel`, {});
  }
}