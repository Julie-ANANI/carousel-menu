import { User } from './user.model';
import { Media } from './media';

export interface Share {
  shareKey?: string;
  created?: Date;
  updated?: Date;
  name: string;
  objectId: string;
  sharedKey: string;
  link: string;
  owner: User;
  sharedObjectId?: string;
  media: Media;
  date: Date;
}
