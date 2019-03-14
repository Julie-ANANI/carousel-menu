import {Innovation} from './innovation';
import {Campaign} from './campaign';


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
  stats?: [{
    delivered: number,
    opened: number,
    clicked: number,
    bounced: number,
    insights: number
  }],
  predictions?: Array<{
    opened: number,
    clicked: number,
    insights: number
  }>
}
