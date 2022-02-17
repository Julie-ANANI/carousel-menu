import { User } from './user.model';
import {UmiusMediaInterface} from '@umius/umi-common-component';

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
  media: UmiusMediaInterface;
  date: Date;
}
