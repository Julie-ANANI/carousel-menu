export interface ExecutiveOwner {
  name: string;
  email: string;
}

export interface ExecutiveObjective {
  objective: string;
  owner: ExecutiveOwner;
  umiCommercial: string;
}

export interface ExecutiveReport {
  readonly _id: string;
  readonly completion: number
  lang: 'en' | 'fr';
  summary: string;
  umiCommercial: string
  owner: ExecutiveOwner;
  objective: string;
  created: Date;
  updated: Date;
}
