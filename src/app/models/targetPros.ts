export interface JobConfig {
  label: { en: string, fr: string };
  state: number;
  _id: string;
}

export interface JobsTypologies {
  state: number;
  jobs: Array<{ state: number, job: JobConfig }>;
  name: { en: string, fr: string };
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
