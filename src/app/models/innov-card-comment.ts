import { User } from './user.model';

export interface CardComment {
  comment?: string;
  suggestion?: string;
}

export interface InnovCardComment {
  innovationCardId?: string;
  owner?: User;
  title?: CardComment;
  problem?: CardComment;
  summary?: CardComment;
  solution?: CardComment;
  advantages?: CardComment;
}
