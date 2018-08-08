import { Media } from './media';
import {Model} from './model';

export class InnovCard extends Model {

  readonly _id?: string;
  readonly innovation_reference?: string;
  readonly title?: string;
  readonly lang: string;
  media?: Array<Media>;
  principalMedia?: Media;
  readonly principalMediaIdx?: number;
  summary?: string;
  problem?: string;
  solution?: string;
  advantages?: Array<{text: string}>;
  readonly principal?: boolean;
  completion?: number;

  constructor(innov?: any) {
    super(innov);
  }

  get completionPercentage(): number {
    let rating = 0;
    const totalRating = 5;

    if (this.title !== '') { rating++; }
    if (this.summary !== '') { rating++; }
    if (this.problem !== '') { rating++; }
    if (this.solution !== '') { rating++; }
    if (this.advantages.length > 0) { rating++; }

    return (rating * 100) / totalRating;
  }
}
