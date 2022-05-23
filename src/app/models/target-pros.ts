export interface TargetProsJobEntry {
  label: string;
  lang: string;
}

// TODO remove multiling
export interface JobConfig {
  hidden?: boolean;
  state: number;
  _id: string;
  hovered?: boolean;
  hoveredState?: number;
  entry?: Array<TargetProsJobEntry>;
}

export interface JobsTypologies {
  state: number;
  jobs: Array<JobConfig>;
  totalCount?: number;
  identifier?: string;
  isToggle?: boolean;
  entry?: Array<TargetProsJobEntry>;
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
