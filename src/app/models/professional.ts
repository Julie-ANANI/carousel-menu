import { Campaign } from './campaign';
import { Tag } from './tag';

export interface Professional {

  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  company: string;
  readonly email: string;
  sent: boolean;
  readonly messages: Array<any>;
  tags: Array<Tag>;
  readonly profileUrl: string;
  country?: string;
  readonly campaigns: Campaign[];
  readonly emailConfidence?: number;
  readonly urlCompany?: string;
  language?: string;
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
  };
}
