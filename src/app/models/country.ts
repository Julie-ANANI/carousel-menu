import {Multiling} from './multiling';

// TODO remove multiling

export interface CountryEntry {
  lang: string;
  value: string
}

export interface Country {
  name?: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly code?: string;
  readonly uri?: string;
  readonly continent?: string;
  readonly subcontinent?: string;
  readonly flag?: string;
  readonly names?: Multiling | Array<CountryEntry>;
  readonly domain?: string;
}
