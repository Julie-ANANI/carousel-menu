import { CampaignSettings } from './camp-settings';
import { Innovation } from './innovation';

export interface CampaignStats {
  campaign: {
    nbProfessionals: number,
    nbFirstTierMails: number,
    nbSecondTierMails: number,
    nbResp: number,
    nbValidatedResp: number,
    nbToValidateResp: number
  },
  nbPros90: number,
  mail: any,
  nbProsSent: number,
  nbStartedAnswer: number,
  nbValidatedAnswers: number,
  nbProsOpened: number,
  nbProsClicked: number,
  nbAnswers: number,
  nbPros: number,
  nbTotalMails: number,
}

export interface Campaign {
  readonly _id?: string;
  readonly domain: string;
  readonly innovation: Innovation;
  readonly owner: string;
  title: string;
  stats?: CampaignStats;
  settings?: CampaignSettings;
  autoBatch: Boolean;
  nuggets?: Boolean;
}

