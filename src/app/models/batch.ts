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
  status?: number,
  active: boolean,
  stats?: {
    delivered: {
      type: number
    },
    opened: {
      type: number
    },
    clicked: {
      type: number
    },
    bounced: {
      type: number
    },
    insights: {
      type: number
    }
  }
}
