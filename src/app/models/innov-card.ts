import { Media } from './media';
import { Model } from './model';
import { InnovCardComment } from './innov-card-comment';

export interface InnovCardSection {
  type: 'ISSUE' | 'SOLUTION';
  title: string;
  content: string;
  visibility: boolean
}

export class InnovCard extends Model {
  readonly _id?: string;
  readonly innovation_reference?: string;
  readonly lang: string;
  title?: string;
  media?: Array<Media>;
  principalMedia?: Media;
  summary?: string;
  problem?: string; // todo remove
  solution?: string; // todo remove
  completion?: number;
  advantages?: Array<{ text: string }>;
  operatorComment?: InnovCardComment
  sections?: Array<InnovCardSection>;
}
