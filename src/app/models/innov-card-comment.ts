import { User } from './user.model';

export interface CardComment {
  type?: string;
  comment?: string;
  suggestion?: string;
}

export interface InnovCardComment {
  innovationCardId?: string;
  owner?: User;
  title?: CardComment;
  problem?: CardComment; //TODO remove
  summary?: CardComment; //TODO remove
  sections?: Array<CardComment>;
  solution?: CardComment;
  advantages?: CardComment;
}

export type CardSections = 'TITLE' | 'SUMMARY' | 'ISSUE' | 'SOLUTION' | 'MEDIA' | '';
