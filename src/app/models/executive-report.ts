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
  sections: Array<ExecutiveSection>;
  conclusion: string;
  umiOperator: string;
  //created: Date;
  //updated: Date;
}

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

export interface ExecutiveSection {
  questionId: string;
  label: string;
  abstract: string;
  questionType: 'PIE' | 'RANKING' | 'BAR' | 'QUOTE' | 'KPI';
  content: SectionPie | SectionRanking | SectionBar | SectionQuote | SectionKpi;
}

export interface SectionKpi {
  kpi: string;
  legend: string;
  examples: Array<string>;
}

export interface SectionQuote {
  showQuotes: boolean;
  quote: string;
  contributor: {
    name: string;
    jobTitle: string;
  };
}

export interface SectionBar {
  showExamples: boolean;
  values: Array< {
    legend: string;
    value: string;
    example: Array<string>;
  }>;
}

export interface SectionPie {
  showPositive: boolean;
  values: Array< {
    p_index: string;
    value: string;
    label: string;
  }>;
}

export interface SectionRanking {
  values: Array< {
    legend: string;
    value: string;
    color: string;
  }>;
}
