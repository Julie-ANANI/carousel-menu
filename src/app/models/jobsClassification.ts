import {Multiling} from './multiling';

export interface JobsClassification {
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
