export interface HelpRequest {
  id: number;
  title: string;
  description: string;
  skillName: string;
  skillCategory: string;
  hoursRequired: number;
  status: 'OPEN' | 'ACCEPTED' | 'COMPLETED';
  createdByName: string;
  createdByRating: number;
  acceptedByName: string;
  applicantCount: number;
  createdAt: string;
  expiresAt: string;
}

export interface CreateHelpRequest {
  title: string;
  description: string;
  skillId: number;
  hoursRequired: number;
}

export interface Application {
  id: number;
  requestId: number;
  requestTitle: string;
  applicantId: number;
  applicantName: string;
  applicantRating: number;
  message: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  appliedAt: string;
}