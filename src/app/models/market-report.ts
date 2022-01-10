import {Multiling} from './multiling';

export interface QuestionReportEntry {
  lang: string;
  title: string;
  subtitle: string;
}

// TODO remove multiling
export interface QuestionReport {
  readonly conclusion?: string;
  entry?: Array<QuestionReportEntry>;

  // TODO remove
  title?: Multiling;
  subtitle?: Multiling;
}
