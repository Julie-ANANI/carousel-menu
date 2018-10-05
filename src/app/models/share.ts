import { User } from './user.model';

export interface Share {
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
}
