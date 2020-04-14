import { User } from './user.model';

export interface Collaborator {
  invitationsToSendAgain: Array<string>;
  usersAdded: Array<User>;
  invitationsToSend: Array<string>;
}
