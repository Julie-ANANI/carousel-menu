export interface JobConfig {
  label: { en: string, fr: string };
  state: number;
  _id: string;
  hovered?: boolean;
  hoveredState?: number;
}

export interface JobsTypologies {
  state: number;
  jobs: Array<JobConfig>;
  name: { en: string, fr: string };
  totalCount?: number;
  identifier?: string;
  isToggle?: boolean;
}

export interface JobsCategory {
  _id: string;
  identifier: string;
  label: { en: string, fr: string };
  jobs: Array<JobConfig>;
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
