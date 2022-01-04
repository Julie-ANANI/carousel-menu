import { EmailTemplate } from './email-template';

export interface TransactionalEmailTemplate {
  lang: string;
  template: EmailTemplate;
}

// TODO remove multiling
export interface TransactionalEmail {
  _id?: string;
  name: string;
  templates?: Array<TransactionalEmailTemplate>;

  /**
   * TODO remove this because from the back will send templates
   */
  en: EmailTemplate;
  fr: EmailTemplate;
}
