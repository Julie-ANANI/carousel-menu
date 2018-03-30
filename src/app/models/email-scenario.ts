import { EmailTemplate } from './email-template';

export interface EmailScenario {
  _id: string;
  readonly name: string;
  emails: Array<EmailTemplate>;
}
