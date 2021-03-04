import { Innovation } from './innovation';
import { User } from './user.model';
import { Multiling } from './multiling';

export type MissionType = 'USER' | 'CLIENT' | 'DEMO' | 'TEST';

export interface  Milestone {
 name: string;
 code: string;
 dueDate: Date;
 comment?: string;
}

export interface MailConfiguration {
  domain: string;
  service: string;
  region: string;
}

export interface Mission {
  readonly _id?: string;
  name?: string;
  innovations?: Array<Innovation>;
  goal?: string;
  client?: User | string;
  team?: Array<User>;
  milestoneDates?: Array<Milestone>;
  mailConf?: Array<MailConfiguration>

  objective?: {
    principal: Multiling;
    secondary: Array<Multiling>;
    comment: string
  };

  externalDiffusion?: {
    umi: boolean; // website
    community: boolean;
    social: boolean;
  };

  type?: MissionType;

}
