export interface Pattern {
  pattern: {expression: string};
  avg?: number
}

interface LogoMedia {
  uri: string;
  alt?: string;
  id?: string;
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
  industries?: Array<string>;
  brands?: Array<string>;
  geographicalZone?: Array<string>;
  companySize?: string;
  valueChain?: string;
}
