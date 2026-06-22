import {
  Component, OnInit, OnDestroy,
  ViewChild, ElementRef, AfterViewChecked
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { ChatService, ChatMessage } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy, AfterViewChecked {

  @ViewChild('messageContainer') messageContainer!: ElementRef;

  messages: ChatMessage[] = [];
  newMessage = '';
  currentUserName = '';
  roomType = '';
  referenceId = 0;
  chatWith = '';
  loading = true;
  connected = false;
  private subscription?: Subscription;
  private shouldScroll = false;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserName = this.authService.getCurrentUser()?.name || '';
    this.route.queryParams.subscribe(params => {
      this.roomType = (params['type'] || 'request').toUpperCase();
      this.referenceId = Number(params['id']);
      this.chatWith = params['with'] || 'User';
      this.initChat();
    });
  }

  initChat(): void {
    this.chatService.getChatHistory(this.roomType, this.referenceId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.loading = false;
        this.shouldScroll = true;
      },
      error: () => this.loading = false
    });

    // ⭐ INTERVIEW: WebSocket connection — subscribe to real time messages
    // Every message published to /topic/chat/ROOMTYPE/ID arrives here instantly
    this.subscription = this.chatService
      .connect(this.roomType, this.referenceId)
      .subscribe(message => {
        // replace optimistic message with real one from server
        const optimisticIdx = this.messages.findIndex(
          m => !m.id &&
               m.content === message.content &&
               m.senderName === message.senderName
        );
        if (optimisticIdx > -1) {
          this.messages[optimisticIdx] = message;
        } else {
          this.messages.push(message);
        }
        this.shouldScroll = true;
      });

    this.connected = true;
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.connected) return;

    const content = this.newMessage.trim();

    // optimistic update — show message immediately without waiting for server
    // ⭐ INTERVIEW: Optimistic updates improve perceived performance
    // Message shows instantly, gets replaced with server response
    this.messages.push({
      referenceId: this.referenceId,
      roomType: this.roomType as any,
      senderName: this.currentUserName,
      content: content,
      sentAt: new Date().toISOString()
    });

    this.shouldScroll = true;
    this.newMessage = '';
    this.chatService.sendMessage(this.referenceId, this.roomType, content);
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  isMyMessage(msg: ChatMessage): boolean {
    return msg.senderName === this.currentUserName;
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop =
        this.messageContainer.nativeElement.scrollHeight;
    } catch (e) {}
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.chatService.disconnect();
  }
}