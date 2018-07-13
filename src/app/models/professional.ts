import {Campaign} from './campaign';

export interface Professional {
  readonly _id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly jobTitle: string;
  company: string;
  readonly email: string;
  readonly profileUrl: string;
  readonly country: string;
  readonly campaigns: Campaign[];
}
