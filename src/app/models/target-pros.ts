export interface TargetProsJobEntry {
  label: string;
  lang: string;
}

export interface JobConfig {
  hidden?: boolean;
  state: number;
  _id: string;
  hovered?: boolean;
  hoveredState?: number;
  entry?: Array<TargetProsJobEntry>;
  // For old projects
  label: { en: string, fr: string };
}

export interface JobsTypologies {
  state: number;
  jobs: Array<JobConfig>;
  totalCount?: number;
  identifier?: string;
  isToggle?: boolean;
  entry?: Array<TargetProsJobEntry>;
  // For old projects
  name: { en: string, fr: string };
}

export interface JobsCategory {
  _id: string;
  identifier: string;
  jobs: Array<JobConfig>;
  entry?: Array<TargetProsJobEntry>;
}

export interface SeniorityLevel {
  name: string;
  state: number;
}

export interface TargetPros {
  searchOperator: 'OR' | 'AND';
  seniorityLevels: {
    [property: string]: SeniorityLevel;
  };
  jobsTypologies: {
    [property: string]: JobsTypologies;
  };
}
