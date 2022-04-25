import { Campaign } from './campaign';
import { Innovation } from './innovation';
import { Tag } from './tag';

export interface ProfessionalAmbassador {
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
}

export interface ProfessionalCost {
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

export interface Professional {
  readonly _id?: string;
  readonly personId?: string;
  readonly messages?: Array<any>;
  readonly campaigns?: Campaign[];
  emailConfidence?: any;
  readonly urlCompany?: string;
  readonly secondEmail?: string;
  profileUrl?: string;
  email: string;
  contactEmail?: string;
  firstName: string;
  lastName: string;
  jobTitle?: string;
  language?: string;
  emailState?: string;
  pattern?: string;
  fullName?: string;
  company?: any;
  companyOriginalName?: string;
  companyDomain?: string;
  innovations?: Array<Innovation>;
  sent?: boolean;
  tags?: Array<Tag>;
  country?: string;
  ambassador?: ProfessionalAmbassador;
  cost?: ProfessionalCost;
}
