import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Session, CreateSession } from '../models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private apiUrl = 'http://localhost:8080/api/sessions';

  constructor(private http: HttpClient) {}

  getAllSessions(keyword?: string): Observable<Session[]> {
    let params = new HttpParams();
    if (keyword) params = params.set('keyword', keyword);
    return this.http.get<Session[]>(this.apiUrl, { params });
  }

  createSession(session: CreateSession): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session);
  }

  requestBooking(sessionId: number): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/${sessionId}/book`, {});
  }

  confirmBooking(sessionId: number, scheduledTime: string): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/${sessionId}/confirm`, { scheduledTime });
  }

  completeSession(sessionId: number): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/${sessionId}/complete`, {});
  }

  getSessionById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`);
  }

  getMySessions(): Observable<Session[]> {
    return this.http.get<Session[]>(`${this.apiUrl}/my`);
  }
}