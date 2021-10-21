import {EmailTemplate} from './email-template';

export interface EmailsObject {
  fr: EmailTemplate;
  en: EmailTemplate;
  campaignId?: string;
  step?: string;
}
