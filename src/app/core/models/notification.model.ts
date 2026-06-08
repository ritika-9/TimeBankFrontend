export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  type: string;
  referenceId: number;
  createdAt: string;
}