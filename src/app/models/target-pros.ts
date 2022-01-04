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

  /**
   * replace this with Array<TargetProsJobEntry>
   * current: { en: string, fr: string }
   */
  label: any;
}

export interface JobsTypologies {
  state: number;
  jobs: Array<JobConfig>;
  totalCount?: number;
  identifier?: string;
  isToggle?: boolean;

  /**
   * replace this with Array<TargetProsJobEntry>
   * current: { en: string, fr: string }
   */
  name: any;
}

export interface JobsCategory {
  _id: string;
  identifier: string;
  jobs: Array<JobConfig>;

  /**
   * replace this with Array<TargetProsJobEntry>
   * current: { en: string, fr: string }
   */
  label: any;
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
