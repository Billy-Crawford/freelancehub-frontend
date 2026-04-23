// types/user.ts
export type UserRole = "client" | "freelance";

export interface ClientProfile {
  id: number;
  bio: string;
  company: string;
  website: string;
  avatar: string | null;
  updated_at: string;
}

export interface FreelanceProfile {
  id: number;
  bio: string;
  skills: string[];
  hourly_rate: string;
  portfolio_url: string;
  avatar: string | null;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  date_joined: string;
  freelance_profile: FreelanceProfile | null;
  client_profile: ClientProfile | null;
}

