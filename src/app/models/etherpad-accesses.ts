import {Session} from './session';

export interface EtherpadAccesses {
  active: boolean;
  authorID: string;
  sessions: Session[];
}
