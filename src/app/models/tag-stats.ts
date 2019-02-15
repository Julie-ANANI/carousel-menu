import { Tag } from './tag';

export interface TagStats {

  _id?: string;

  tag: Tag;

  totalInnovations: number;

  totalAnswers: number;

  countMarketNeed: number;

  countMarketDiff: number;

  countMarketInterest: number;

  geographicalRepartition: Array<{ country: string, count: number }>;

  readonly created?: Date;

  readonly updated?: Date;
}
