import { Media } from './media';
import {Model} from './model';

export class InnovCard extends Model {

  readonly _id?: string;
  readonly innovation_reference?: string;
  title?: string;
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
}
