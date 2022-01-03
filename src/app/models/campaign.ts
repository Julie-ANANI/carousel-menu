import { CampaignSettings } from './camp-settings';
import { Innovation } from './innovation';
import { TargetPros } from './target-pros';

export interface SearchStats {
  uniqueGoodEmails: number;
  uniqueBadEmails: number;
  uniqueUncertain: number;
  uniqueShielded: number;
  uniqueIdentified: number;
  identified: number;
}

export interface ProsStats {
  goodEmails: number;
  riskyEmails: number;
  badEmails: number;
  batched: number;
}

export interface MailStats {
  totalPros: number;
  totalMails: number;
  statuses: {
    opened: number;
    delivered: number;
    clicked: number;
    accepted: number;
  },
  nbFirstMail: number;
  nbSecondMail: number;
  nbThirdMail: 0
}

export interface BatchesStats {
  goodEmails: number;
  riskyEmails: number;
  shot1Excepted: number;
  shot2Excepted: number;
  shot3Excepted: number;
}

export interface CampaignStats {
  campaign: {
    nbProfessionals: number,
    nbFirstTierMails: number,
    nbValidatedResp: number,
    nbToValidateResp: number
  };
  search: SearchStats;
  pros: ProsStats;
  mail: MailStats;
  batches: BatchesStats;
  nbPros90: number;
}

export interface Campaign {
  readonly _id?: string;
  readonly domain: string;
  readonly innovation: Innovation;
  readonly owner: string;
  title: string;
  stats?: CampaignStats;
  updatedStats?: Date;
  settings?: CampaignSettings;
  autoBatch: Boolean;
  nuggets?: Boolean;
  targetCountries?: Array<string>;
  type?: string;
  status?: string;
  targetPros?: TargetPros;
  rgpd?: boolean;
}

