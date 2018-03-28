import { EmailSignature } from './email-signature';

export interface EmailTemplate {
  _id?: string;
  step: string;
  profile: string;
  subject: string;
  content: string;
  signature?: EmailSignature;
}
