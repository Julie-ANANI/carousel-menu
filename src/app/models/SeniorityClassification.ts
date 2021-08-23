export interface SeniorityClassification {
  timestamp: Date;
  seniorityLevels: [
    {
      name: String;
      count: number;
    }
  ];
  total: number;
}
