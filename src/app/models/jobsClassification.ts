import {Multiling} from './multiling';
import {EmailType} from "./SeniorityClassification";

export interface JobsClassification {
  emailConfidence: EmailType;
  timestamp: Date;
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
  total: number;
}
