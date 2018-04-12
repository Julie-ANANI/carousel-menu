import { EmailTemplate } from './email-template';

export interface EmailScenario {
  _id?: string;
  name: string;
  emails: Array<EmailTemplate>;
}
