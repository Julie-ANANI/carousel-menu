export interface InnovationSettings {
  readonly geography: {
    readonly continentTarget: {
      readonly africa: boolean;
      readonly oceania: boolean;
      readonly asia: boolean;
      readonly russia: boolean;
      readonly europe: boolean;
      readonly americaNord: boolean;
      readonly americaSud: boolean;
    };
    readonly exclude: Array<>;
    readonly comments: string;
  };
  readonly market: {
    readonly sectors: Array<string>;
    readonly comments: string;
  };
  readonly companies: {
    readonly include: Array<>;
    readonly exclude: Array<>;
    readonly description: string;
  };
  readonly professionals: {
    readonly examples: string;
    readonly exclude: Array<>;
    readonly description: string;
  };
  readonly keywords: Array<string>;
  readonly comments: string;
  readonly blacklist: {
    readonly domains: Array<string>;
    readonly emails: Array<string>;
    readonly people: Array<>;
  };
}
