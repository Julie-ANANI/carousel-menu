import { Innovation } from './innovation';
import { User } from './user.model';
import { Multiling } from './multiling';

export type MissionType = 'USER' | 'CLIENT' | 'DEMO' | 'TEST';

export interface MissionQuestion {
  readonly _id: string;

  entry: Array<{
    label: string; // Intitulé de la question (text used in the Quiz)
    lang: string;
    objective: string; // text that we show to the client.
  }>;

}

export interface MissionTemplate {
  readonly _id: string;
  essentials: Array<MissionQuestion>; // questions defined by us, compulsory for every market test.
  complementary: Array<MissionQuestion>; // additional questions defined by us, user has right to select more then one.
  comment?: string;

  entry: Array<{
    label: string;
    lang: string;
    objective: string; // name of the template (show to the user)
  }>;
}

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
  mailConf?: Array<MailConfiguration>;

  /**
   * the use case selected by the user for the Market Test.
   */
  template?: MissionTemplate;

  /**
   * do not use it any more
   */
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
