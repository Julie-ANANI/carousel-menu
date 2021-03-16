export interface ExecutiveReport {
  readonly _id: string;
  readonly completion: number;
  lang: 'en' | 'fr';
  summary: string;
  sale: string;
  client: ExecutiveClient;
  objective: string;
  targeting: ExecutiveTargeting;
  professionals: ExecutiveProfessional;
  sections: Array<ExecutiveSection>;
  conclusion: string;
  operator: string;
  answers: string;
  externalDiffusion: boolean;
}

export interface ExecutiveClient {
  name: string;
  email: string;
  company: {
    name: string;
    logo: {
      uri: string;
      id: string;
      alt: string;
    };
    topLevelDomain: string;
    id: string;
  };
}

export interface ExecutiveProfessional {
  abstract: string;
  list: Array<string>;
}

export interface ExecutiveObjective {
  objective: string;
  client: ExecutiveClient;
  sale: string;
}

export interface ExecutiveTargeting {
  abstract: string;
  countries: Array<string>;
  countriesall: boolean;
}

export interface ExecutiveConclusion {
  operator: string;
  conclusion: string;
}

export interface ExecutiveSection {
  questionId: string;
  title: string;
  abstract: string;
  questionType: 'PIE' | 'RANKING' | 'BAR' | 'QUOTE' | 'KPI' | '';
  content: SectionPie | SectionRanking | SectionBar | SectionQuote | SectionKpi;
}

export interface SectionKpi {
  kpi: string;
  legend: string;
  examples: string;
}

export interface SectionQuote {
  showQuotes: boolean;
  quotation: string;
  name: string;
  job: string;
}

export interface SectionBar {
  showExamples: boolean;
  values: Array<{
    name: string;
    percentage: number;
    legend: string;
    visibility: boolean;
  }>;
}

export interface SectionPie {
  favorable_answers: {
    percentage: number;
    visibility: boolean
  };
  values: Array<{
    percentage: number;
    answers: number;
    legend: string;
    color: string;
  }>;
}

export interface SectionRanking {
  values: Array<{
    name: string;
    legend: string;
    visibility: boolean;
    color: string
  }>;
}
