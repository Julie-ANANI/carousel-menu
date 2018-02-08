export interface InnovationSettings {
  readonly geography: {
    continentTarget: {
      readonly africa: boolean;
      readonly oceania: boolean;
      readonly asia: boolean;
      readonly russia: boolean;
      readonly europe: boolean;
      readonly americaNord: boolean;
      readonly americaSud: boolean;
    };
    exclude: Array<any>;
    readonly comments: string;
  };
  readonly market: {
    readonly sectors: Array<string>;
    readonly comments: string;
  };
  readonly companies: {
    readonly include: Array<any>;
    exclude: Array<any>;
    readonly description: string;
  };
  readonly professionals: {
    readonly examples: string;
    exclude: Array<any>;
    readonly description: string;
  };
  keywords: Array<string>;
  comments: string;
  readonly blacklist: {
    domains: Array<string>;
    emails: Array<string>;
    readonly people: Array<any>;
  };
}
