import { Media } from './media';
import { Model } from './model';

export class InnovCard extends Model {
  readonly _id?: string;
  readonly innovation_reference?: string;
  readonly lang: string;
  title?: string;
  media?: Array<Media>;
  principalMedia?: Media;
  summary?: string;
  problem?: string;
  solution?: string;
  completion?: number;
  advantages?: Array<{ text: string }>;
}
