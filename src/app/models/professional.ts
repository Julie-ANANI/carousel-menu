import { Campaign } from './campaign';
import { Tag } from './tag';

export interface Professional {
  readonly _id: string;

  readonly personId: string;

  readonly messages: Array<any>;

  readonly campaigns: Campaign[];

  readonly emailConfidence?: number;

  readonly urlCompany?: string;

  profileUrl: string;

  email: string;

  firstName: string;

  lastName: string;

  jobTitle: string;

  language?: string;

  emailState?: string;

  pattern?: string;

  fullName?: string;

  company: string;

  companyDomain?: string;

  sent: boolean;

  tags: Array<Tag>;

  country?: string;

  ambassador?: {
    is?: boolean,
    positionLevel?: string,
    persona?: string,
    industry?: string,
    experience?: string,
    ambassadorStatus?: string,
    ambassadorCommitment?: Array<any>,
    qualification?: number,
    qualificationWhy?:string,
    ambassadorSource?: string,
    notes?: string;
    activity?: number;
    motivations?: number;
  };

  cost?: {
    bingQuery?: number;
    emailFormatQuery?: number
    googleQuery?: number
    hubucoQuery?: number
    neverBounceQuery?: number
    step?: number
    totalCost?: number
    verifyMailQuery?: number
    yahooQuery?: number
  }

}
