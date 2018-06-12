import { Media } from './media';

export interface InnovCard {
  readonly _id?: string;
  readonly innovation_reference?: string;
  readonly title?: string;
  readonly lang: string;
  readonly media?: Array<Media>;
  readonly principalMedia?: Media;
  readonly principalMediaIdx?: number;
  readonly summary?: string;
  problem?: string;
  solution?: string;
  readonly advantages?: Array<{text: string}>;
  readonly principal?: boolean;
}
