export interface SeniorityClassification {
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
