export interface Pattern {
  expression: string;
  avg?: number;
}

interface LogoMedia {
  uri: string;
  alt?: string;
  id?: string;
}

export interface Industry {
  label: string;
  code: '';
}

export interface Brand {
  label: string;
  url: '';
}

export interface GeographicalZone {
  scope: ScopeEnum;
  name: string;
}

export enum ScopeEnum {
  country = 'country', continent = 'continent', world = 'world'
}

export interface Enterprise {
  _id?: string;
  name: string;
  topLevelDomain: string;
  enterpriseURL?: string;
  logo?: LogoMedia;
  subsidiaries?: Array<string>;
  parentEnterprise?: string;
  patterns?: Array<Pattern>;
  enterpriseType?: string;
  industries?: Array<Industry>;
  brands?: Array<Brand>;
  geographicalZone?: Array<GeographicalZone>;
  companySize?: string;
  valueChain?: string;
}
