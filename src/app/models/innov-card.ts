import {Media} from './media';
import {Model} from './model';
import {User} from './user.model';
import {CollaborativeComment} from './collaborative-comment';

export interface CardComment {
  type?: string;
  comment?: string;
  suggestion?: string;
}

export interface InnovCardSection {
  type: CardSectionTypes;
  title: string;
  content: string | Array<Media>;
  visibility: boolean;
  comments?: CollaborativeComment[];
  etherpadElementId?: string;
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
  readonly innovation_reference?: string;
  readonly lang: string;
  title?: string;
  media?: Array<Media>;
  principalMedia?: Media;
  summary?: string;
  advantages?: Array<{ text: string }>;
  operatorComment?: InnovCardComment;
  sections?: Array<InnovCardSection>;
}

export type CardSectionTypes = 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA' | 'OTHER' | '';
