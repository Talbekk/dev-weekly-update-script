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

export interface Workflow {
    id: number;
    auto_assign_owner: boolean;
    created_at: string;
    default_state_id: number;
    description: string;
    entity_type: string;
    name: string;
    project_ids: number[];
    states: WorkflowState[];
    team_id: number;
    updated_at: string;
}

export interface WorkflowState {
    color: string;
    created_at: string;
    description: string;
    entity_type: string;
    id: number;
    name: string;
    num_stories: number;
    num_story_templates: number;
    position: number;
    type: string;
    updated_at: string;
    verb: string;
}