import { Innovation } from './innovation';
import { User } from './user.model';

export interface  Milestone {
 name: string;
 code: string;
 dueDate: string;
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
  client?: User;
  team?: Array<User>;
  milestoneDates?: Array<Milestone>;
  mailConf?: Array<MailConfiguration>
}
