import {EmailType} from "./seniority-classification";

export interface JobClassificationCategoryEntry {
  lang: string;
  label: string;
}

export interface JobClassificationCategoryJob {
  count: number;
  entry: Array<JobClassificationCategoryEntry>;
}

export interface JobClassificationCategory {
  count: number;
  entry: Array<JobClassificationCategoryEntry>;
  jobs: Array<JobClassificationCategoryJob>;
}

// TODO remove multiling
export interface JobsClassification {
  emailConfidence: EmailType;
  timestamp: Date;
  total: number;
  categories: Array<JobClassificationCategory>;

  /**
   * TODO delete the commented part after multilang migration
   */
  /*categories: [
    {
      label: UmiusMultilingInterface;
      count: number;
      jobs: [{
        label: UmiusMultilingInterface;
        count: number;
      }];
    }
  ];*/
}
