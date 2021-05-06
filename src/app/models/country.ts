import {Multiling} from './multiling';

export interface Country {
  name?: string;
  latitude?: number;
  longitude?: number;
  code?: string;
  uri?: string;
  continent?: string;
  subcontinent?: string;
  flag?: string;
  names?: Multiling;
}
