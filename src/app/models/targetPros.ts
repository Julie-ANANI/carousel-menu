export interface JobConfig {
  label: { en: string, fr: string };
  state: number;
  _id: string;
}


export interface JobsTypologies {
  state: number;
  jobs: Array<JobConfig>;
  name: { en: string, fr: string };
}

export interface JobsCategory {
  _id: string;
  identifier: string;
  label: { en: string, fr: string };
  jobs: Array<JobConfig>;
}

export interface TargetPros {
  searchOperator: 'OR' | 'AND';
  seniorityLevels: {
    [property: string]: number;
  };
  jobsTypologies: {
    [property: string]: JobsTypologies;
  };
}
