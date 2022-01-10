import {Innovation} from './innovation';
import {Campaign} from './campaign';

export interface BatchStat {
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  insights: number;
}

export interface BatchPrediction {
  opened: number;
  clicked: number;
  insights: number;
}

export interface Batch {
  _id?: string,
  innovation?: Innovation,
  campaign: Campaign,
  firstMail?: any,
  secondMail?: any,
  thirdMail?: any,
  sendNow?: boolean,
  size: number,
  workflow?: string,
  status?: number,
  active: boolean,
  nuggets?: Boolean,
  stats?: Array<BatchStat>;
  predictions?: Array<BatchPrediction>;
  childBatch?: Array<string>;
}
