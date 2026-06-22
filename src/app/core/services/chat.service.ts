import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id?: number;
  referenceId: number;
  roomType: 'REQUEST' | 'SESSION';
  senderName: string;
  content: string;
  sentAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8080/api/chat';
  private stompClient: Client | null = null;
  private messageSubject = new Subject<ChatMessage>();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // ⭐ INTERVIEW: How does WebSocket connection work?
  // 1. Create SockJS connection to /ws endpoint
  // 2. Wrap with STOMP protocol (gives us pub/sub messaging)
  // 3. Subscribe to a topic channel
  // 4. Any message published to that channel arrives instantly
  connect(roomType: string, referenceId: number): Observable<ChatMessage> {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = new Client({
      webSocketFactory: () => socket as any,
      connectHeaders: {
        Authorization: `Bearer ${this.authService.getToken()}`
      },
      onConnect: () => {
        this.stompClient?.subscribe(
          `/topic/chat/${roomType}/${referenceId}`,
          (message) => {
            const body = JSON.parse(message.body);
            this.messageSubject.next(body);
          }
        );
      }
    });

    this.stompClient.activate();
    return this.messageSubject.asObservable();
  }

  sendMessage(referenceId: number, roomType: string, content: string): void {
    if (this.stompClient?.connected) {
      this.stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify({ referenceId, roomType, content })
      });
    }
  }

  disconnect(): void {
    this.stompClient?.deactivate();
  }

  getChatHistory(roomType: string, referenceId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.apiUrl}/${roomType}/${referenceId}`);
  }
}