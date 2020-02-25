export interface ExecutiveReport {
  readonly _id: string;
  readonly completion: number
  lang: 'en' | 'fr';
  summary: string;
  sale: string
  client: ExecutiveClient;
  objective: string;
  targeting: ExecutiveTargeting;
  professionals: ExecutiveProfessional;
  sections: Array<ExecutiveSection>;
  conclusion: string;
  operator: string;
  answers: string;
}

export interface ExecutiveClient {
  name: string;
  email: string;
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
}

export interface ExecutiveConclusion {
  operator: string;
  conclusion: string
}

export interface ExecutiveSection {
  questionId: string;
  title: string;
  abstract: string;
  questionType: 'PIE' | 'RANKING' | 'BAR' | 'QUOTE' | 'KPI' | '';
  content: SectionPie | SectionRanking | SectionBar | SectionQuote | SectionKpi;
}

export interface SectionKpi {
  value: number;
  name: string;
  examples: string;
}

export interface SectionQuote {
  showQuotes: boolean;
  quote: string;
  author: {
    name: string;
    jobTitle: string;
  };
}

export interface SectionBar {
  showExamples: boolean;
  values: Array<{
    name: string;
    value: number;
    visibility: boolean;
    example: string;
  }>;
}

export interface SectionPie {
  showPositive: boolean;
  favorable: string;
  values: Array<{
    answers: number;
    percentage: number;
    legend: number
  }>;
}

export interface SectionRanking {
  color: string;
  values: Array<{
    name: string;
    occurrence: string;
    visibility: boolean;
  }>;
}
