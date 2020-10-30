import {Session} from './session';

export interface EtherpadAccesses {
  authorID: string;
  sessions: Session[];
}
