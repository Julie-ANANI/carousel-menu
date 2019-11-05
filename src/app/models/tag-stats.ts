import { Tag } from './tag';

export interface TagStats {

  _id?: string;

  static?: boolean; // define if we need to load the data dynamically or if it is static

  tag?: Tag;

  totalInnovations?: number;

  totalAnswers?: number;

  countContext?: number;

  totalCountContext?: number;

  countNeed?: number;

  totalCountNeed?: number;

  countRelevance?: number;

  totalCountRelevance?: number;

  countDiff?: number;

  totalCountDiff?: number;

  countLeads?: number;

  geographicalRepartition?: Array<{ country: string, count: number }>;

  readonly created?: Date;

  readonly updated?: Date;
}
