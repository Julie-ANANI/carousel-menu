import { EmailTemplate } from './email-template';

export interface TransactionalEmail {
  _id?: string;
  name: string;
  en: EmailTemplate;
  fr: EmailTemplate;
}
