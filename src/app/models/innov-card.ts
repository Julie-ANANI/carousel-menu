import {Model} from './model';
import {User} from './user.model';
import {CollaborativeComment} from './collaborative-comment';
import {UmiusMediaInterface} from '@umius/umi-common-component';

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
  content: string | Array<UmiusMediaInterface>;
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
  shotSent?: boolean;
  status?: string;
  hidden?: boolean;
  title?: string;
  media?: Array<UmiusMediaInterface>;
  principalMedia?: UmiusMediaInterface;
  summary?: string;
  advantages?: Array<{ text: string }>;
  operatorComment?: InnovCardComment;

  /**
   * a card can can have more sections of type OTHER
   * but only one for rest type.
   */
  sections?: Array<InnovCardSection>;
}
