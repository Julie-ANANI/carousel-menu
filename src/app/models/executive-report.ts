export interface ExecutiveOwner {
  name: string;
  email: string;
}

export interface ExecutiveProfessional {
  abstract: string;
  list: Array<string>;
}

export interface ExecutiveObjective {
  objective: string;
  owner: ExecutiveOwner;
  umiCommercial: string;
}

export interface ExecutiveTargeting {
  abstract: string;
  countries: Array<string>;
}

export interface ExecutiveConclusion {
  umiOperator: string;
  conclusion: string
}

export interface ExecutiveReport {
  readonly _id: string;
  readonly completion: number
  lang: 'en' | 'fr';
  summary: string;
  umiCommercial: string
  owner: ExecutiveOwner;
  objective: string;
  targeting: ExecutiveTargeting;
  professionals: ExecutiveProfessional;
  conclusion: string;
  umiOperator: string;
  //created: Date;
  //updated: Date;
}
