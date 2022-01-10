import {EmailTemplate} from './email-template';

export interface EmailMultiling {
  [lang: string]: {
    subject?: string;
    content?: string;
    body?: string;
    signature?: string;
  }
}

export interface EmailsObjectEntry {
  lang: string;
  template: EmailTemplate;
}

export interface EmailsObject {
  templates?: Array<EmailsObjectEntry>;
  campaignId?: string;
  step?: string;

  // TODO remove multiling
  fr: EmailTemplate;
  en: EmailTemplate;
}
