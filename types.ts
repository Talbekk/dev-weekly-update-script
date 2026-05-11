import type { AxiosInstance } from "axios";

export type ApiClient = AxiosInstance;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Epic {
  id: number;
  name: string;
  completed: boolean;
  completed_at: string | null;
  [key: string]: unknown;
}

export interface Story {
  id: number;
  name: string;
  estimate: number | null;
  story_type: "feature" | "bug" | "chore";
  epic_id: number | null;
  [key: string]: unknown;
}
