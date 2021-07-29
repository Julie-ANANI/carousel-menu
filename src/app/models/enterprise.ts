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
  subsidiariesName?: Array<any>;
  parentEnterprise?: string;
  parentEnterpriseName?: string;
  parentEnterpriseObject?: any;
  patterns?: Array<Pattern>;
  enterpriseType?: string;
  industries?: Array<Industry>;
  brands?: Array<Brand>;
  subsidiariesList?: Array<any>;
  geographicalZone?: Array<GeographicalZone>;
  enterpriseSize?: string;
  valueChain?: Array<string>;
}


export interface FamilyEnterprises {
  mySubsidiaries?: Array<Enterprise>;
  parent?: Enterprise;
  subsidiariesOfParent?: Array<Enterprise>;
}
