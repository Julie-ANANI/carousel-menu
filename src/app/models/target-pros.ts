export interface TargetProsJobEntry {
  value: string;
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

  /**
   * replace this with Array<TargetProsJobEntry>
   */
  label: { en: string, fr: string };
}

export interface JobsTypologies {
  state: number;
  jobs: Array<JobConfig>;
  totalCount?: number;
  identifier?: string;
  isToggle?: boolean;
  entry?: Array<TargetProsJobEntry>;

  /**
   * replace this with Array<TargetProsJobEntry>
   */
  name: { en: string, fr: string };
}

export interface JobsCategory {
  _id: string;
  identifier: string;
  jobs: Array<JobConfig>;
  entry?: Array<TargetProsJobEntry>;

  /**
   * replace this with Array<TargetProsJobEntry>
   */
  label: { en: string, fr: string };
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
