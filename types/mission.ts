// types/mission.ts
export type MissionStatus = "open" | "in_progress" | "completed" | "cancelled";

export interface Mission {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: MissionStatus;
  skills: string[];
  client: number;
}

export interface MissionApplication {
  id: number;
  mission: number;
  freelancer: number;
  freelancer_email?: string;
  cover_letter: string;
  proposed_rate: number;
  status: string;
}

export interface MyApplication {
  client_id: any;
  mission: any;
  id: number;
  cover_letter: string;
  proposed_rate: number;
  status: string;
  mission_title: string;
}


