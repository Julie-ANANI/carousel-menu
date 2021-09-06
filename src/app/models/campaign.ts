import { CampaignSettings } from './camp-settings';
import { Innovation } from './innovation';
import { TargetPros } from './targetPros';

export interface CampaignStats {
  campaign: {
    nbProfessionals: number,
    nbFirstTierMails: number,
    nbSecondTierMails: number,
    nbResp: number,
    nbValidatedResp: number,
    nbToValidateResp: number
  };
  pro: {
    uniqueGoodEmails: number;
    uniqueBadEmails: number;
    uniqueUncertain: number;
    uniqueShielded: number;
    uniqueIdentified: number;
    identified: number;
  };
  nbPros90: number;
  mail: any;
  nbProsSent: number;
  nbStartedAnswer: number;
  nbValidatedAnswers: number;
  nbProsReceived: number;
  nbProsOpened: number;
  nbProsClicked: number;
  nbAnswers: number;
  nbPros: number;
  nbTotalMails: number;
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
}

