export interface Session {
  id: number;
  title: string;
  description: string;
  skillName: string;
  skillCategory: string;
  credits: number;
  duration: number;
  status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
  offeredByName: string;
  offeredByRating: number;
  bookedByName: string;
  scheduledTime: string;
  createdAt: string;
  expiresAt: string;
}

export interface CreateSession {
  title: string;
  description: string;
  skillId: number;
  credits: number;
  duration: number;
}