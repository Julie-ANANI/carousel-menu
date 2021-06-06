import { User } from './user.model';
import {Consent} from './consent';

export interface Collaborator {
  invitationsToSendAgain: Array<string>;
  usersAdded: Array<User>;
  invitationsToSend: Array<string>;
  consent?: Consent;
}
