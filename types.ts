import type { AxiosInstance } from "axios";

export type ApiClient = AxiosInstance;

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Epic {
  id: number;
  app_url: string;
  archived: boolean
  associated_groups: any[];
  completed: boolean;
  completed_at: string | null;
  completed_at_override: string | null;
  created_at: string;
  deadline: string | null;
  description: string;
  entity_type: string;
  epic_state_id: number;
  external_id: string | null;
  follower_ids: string[];
  group_id: string | null;
  group_ids: string[];
  group_mention_ids: string[];
  label_ids: number[];
  labels: any[];
  member_mention_ids: string[];
  mention_ids: string[];
  milestone_id: number | null;
  name: string;
  objective_ids: number[];
  owner_ids: string[];
  planned_start_date: string | null;
  position: number;
  productboard_id: string | null;
  productboard_name: string | null;
  productboard_plugin_id: string | null;
  productboard_url: string | null;
  project_ids: number[];
  requested_by_id: string | null;
  started: boolean;
  started_at: string | null;
  started_at_override: string | null;
  state: string;
  stats: {
    last_story_update: string | null;
    num_points: number;
    num_points_backlog: number;
    num_points_done: number;
    num_points_started: number;
    num_points_unstarted: number;
    num_related_documents: number;
    num_stories_backlog: number;
    num_stories_done: number;
    num_stories_started: number;
    num_stories_total: number;
    num_stories_unestimated: number;
    num_stories_unstarted: number;
  };
  stories_without_projects: number;
  updated_at: string;
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