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

