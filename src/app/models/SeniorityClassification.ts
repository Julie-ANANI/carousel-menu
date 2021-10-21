export type EmailType = 'RISKY' | 'GOOD' | 'ALL';

export interface SeniorityClassification {
  emailConfidence: EmailType;
  timestamp: Date;
  seniorityLevels: [
    {
      _id: string;
      name: string;
      count: number;
    }
  ];
  total: number;
}
