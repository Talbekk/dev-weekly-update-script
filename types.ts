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
  labels: any[];
}

interface DisplayIcon {
    created_at: string;
    entity_type: string;
    id: string;
    updated_at: string;
    url: string;
}

export interface Group {
  id: string;
  app_url: string;
  archived: boolean;
  color: string | null;
  color_key: string;
  created_at: string;
  default_workflow_id: number;
  description: string;
  display_icon: DisplayIcon;
  entity_type: string;
  global_id: string;
  member_ids: string[];
  mention_name: string;
  name: string;
  num_epics_started: number;
  num_stories: number;
  num_stories_backlog: number;
  num_stories_started: number;
  updated_at: string;
  workflow_ids: number[];
}
