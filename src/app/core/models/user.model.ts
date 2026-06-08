export interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
  credits: number;
  reservedCredits: number;
  rating: number;
  availability: string;
  skillsOffered: string[];
  skillsNeeded: string[];
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  credits: number;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}