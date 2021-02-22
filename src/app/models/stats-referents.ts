export interface StatsReferents {
  _id?: string;
  readonly created?: Date;
  readonly updated?: Date;
  innovations: {
    openRate: number,
    clickToOpenRate: number,
    quizAttractiveness: number,
    answerRate: number
  };
  campaigns: {
    identificationEfficiency: number,
    shieldImpact: number,
    inabilityToValidate: number,
    redundancy: number,
    deductionEfficiency: number
  };
}
