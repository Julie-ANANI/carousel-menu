import { Tag } from './tag';

export interface TagStats {

  _id?: string;

  tag?: Tag;

  totalInnovations: number;

  totalAnswers: number;

  countNeed: number;

  countDiff: number;

  countLeads: number;

  geographicalRepartition: Array<{ country: string, count: number }>;

  readonly created?: Date;

  readonly updated?: Date;
}
