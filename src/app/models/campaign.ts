import { CampaignSettings } from './camp-settings';

export interface Campaign {
  readonly _id?: string;
  readonly domain: string;
  readonly innovation: string;
  readonly owner: string;
  readonly title: string;
  stats?: any;
  settings?: CampaignSettings;
}
