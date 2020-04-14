import { User } from './user.model';

export interface ClientProject {
  readonly _id?: string;

  commercial?: User;
  client?: User;
  marketTests?: Array<string>;

  name: string;
  roadmapDates: Array<{
    name: string;
    code: string;
    date: Date;
  }>

}
