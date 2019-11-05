import { User } from './user.model';

export interface InnovCardComment {
  innovationCardId?: string;
  owner?: User;

  title?: {
    comment?: string,
    suggestion?: string,
  };

  problem?: {
    comment?: string,
    suggestion?: string,
  };

  summary?: {
    comment?: string,
    suggestion?: string,
  };

  solution?: {
    comment?: string,
    suggestion?: string,
  };

  advantages?: {
    comment?: string,
  };
}
