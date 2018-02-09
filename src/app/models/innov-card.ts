import { Media } from './media';

export interface InnovCard {
  readonly _id?: string;
  readonly title?: string;
  readonly lang: string;
  readonly media?: Array<Media>;
  readonly principalMediaIdx?: number;
  readonly summary?: string;
  readonly problem?: string;
  readonly solution?: string;
  readonly advantages?: Array<string>;
  readonly principal?: boolean;
}
