import { Media } from './media';

export interface InnovCard {
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
}
