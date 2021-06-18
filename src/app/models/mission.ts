import { Innovation } from './innovation';
import { User } from './user.model';
import { Multiling } from './multiling';
import {CardSectionTypes} from './innov-card';

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
  readonly sections: Array<CardSectionTypes>; // length of array represents the number of the section in innovation card with type.
  essentials: Array<MissionQuestion>; // questions defined by us, compulsory for every market test.
  complementary: Array<MissionQuestion>; // additional questions defined by us, user has right to select more then one.

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
   * comment written for the template.
   */
  objectiveComment?: string;

  /**
   * not using anymore. It's there for the old projects.
   * on 1st June, 2021
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
