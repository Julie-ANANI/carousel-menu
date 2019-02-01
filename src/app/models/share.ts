import { User } from './user.model';
import { Media } from './media';

export interface Share {
  name?: string;
  objectId?: string;
  sharedKey?: string;
  shareKey?: string;
  sharedObjType?: string;
  created?: Date;
  owner?: User;
  recipient?: User;
  updated?: Date;
  sharedObjectId?: string;
  _id?: string;
  media?: Media;
  date?: Date;
}
