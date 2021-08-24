export interface SeniorityClassification {
  timestamp: Date;
  seniorityLevels: [
    {
      _id: string;
      name: String;
      count: number;
    }
  ];
  total: number;
}
