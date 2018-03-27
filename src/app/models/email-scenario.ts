import { EmailTemplate } from './email-template';

export interface EmailScenario {
  _id: string;
  readonly name: string;
  readonly emails: Array<EmailTemplate>;
}
