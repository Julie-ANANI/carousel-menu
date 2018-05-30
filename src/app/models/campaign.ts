import { CampaignSettings } from './camp-settings';
import { Innovation } from './innovation';

export interface Campaign {
  readonly _id?: string;
  readonly domain: string;
  readonly innovation: Innovation;
  readonly owner: string;
  title: string;
  stats?: any;
  settings?: CampaignSettings;
  autoBatch: Boolean;
}
