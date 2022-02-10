import {EmailTemplate} from './email-template';

export interface EmailObject {
  en: EmailTemplate;
  fr: EmailTemplate;
  campaignId?: string;
  step?: string;
  num?: string;
  _isSelected?: boolean;
}
