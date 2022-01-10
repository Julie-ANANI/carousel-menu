import {Multiling} from './multiling';
import {EmailType} from "./seniority-classification";

export interface JobClassificationCategoryLabel {
  lang: string;
  value: string;
}

export interface JobClassificationCategoryJob {
  count: number;
  label: Array<JobClassificationCategoryLabel>;
}

export interface JobClassificationCategory {
  count: number;
  label: Array<JobClassificationCategoryLabel>;
  jobs: Array<JobClassificationCategoryJob>;
}

// TODO remove multiling
export interface JobsClassification {
  emailConfidence: EmailType;
  timestamp: Date;
  total: number;

  /**
   * TODO replace this with JobClassificationCategory
   */
  categories: [
    {
      label: Multiling;
      count: number;
      jobs: [{
        label: Multiling;
        count: number;
      }];
    }
  ];
}
