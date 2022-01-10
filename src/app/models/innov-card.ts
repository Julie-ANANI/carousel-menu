import {Media} from './media';
import {Model} from './model';
import {User} from './user.model';
import {CollaborativeComment} from './collaborative-comment';

export type CardSectionTypes = 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA' | 'OTHER' | 'CONTEXT' | '';

export interface CardComment {
  type?: string;
  comment?: string;
  suggestion?: string;
  sectionId?: string;
}

export interface InnovCardSection {
  readonly _id?: string;
  type: CardSectionTypes;
  title: string;
  content: string | Array<Media>;
  visibility: boolean;
  comments?: CollaborativeComment[];
  etherpadElementId?: string;
  index?: number;
}

export interface InnovCardComment {
  innovationCardId?: string;
  owner?: User;
  title?: CardComment;
  summary?: CardComment;
  sections?: Array<CardComment>;
  advantages?: CardComment;
}

export class InnovCard extends Model {
  readonly _id?: string;
  readonly created?: Date;
  readonly updated?: Date;
  readonly innovation_reference?: string;
  readonly lang: string;

  title?: string;
  media?: Array<Media>;
  principalMedia?: Media;
  summary?: string;
  advantages?: Array<{ text: string }>;
  operatorComment?: InnovCardComment;

  /**
   * a card can can have more sections of type OTHER
   * but only one for rest type.
   */
  sections?: Array<InnovCardSection>;
}
