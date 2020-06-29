import { Country } from './country';

export interface GeographySettings {
  continentTarget: {
    readonly africa: boolean;
    readonly oceania: boolean;
    readonly asia: boolean;
    readonly europe: boolean;
    readonly americaNord: boolean;
    readonly americaSud: boolean;
  };
  exclude: Array<Country>;
  include: Array<Country>;
  comments?: string;
}

export interface InnovationSettings {

  geography: GeographySettings;

  readonly market: {
    readonly sectors: Array<string>;
    comments: string;
  };

  contact?: {
    internal: boolean;
  }

  readonly companies: {
    include: Array<any>;
    exclude: Array<any>;
    description: string;
  };

  readonly professionals: {
    readonly examples: string;
    exclude: Array<any>;
    description: string;
  };

  keywords: Array<string>;
  comments: string;

  readonly blacklist: {
    domains: Array<string>;
    emails: Array<string>;
    readonly people: Array<any>;
  };

  domain?: any; // {en: string, fr: string},

}
