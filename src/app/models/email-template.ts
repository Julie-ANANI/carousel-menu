import { EmailSignature } from './email-signature';

export interface EmailTemplate {
  _id: string;
  readonly name: string;
  readonly step: string;
  readonly profile: string;
  readonly subject: string;
  readonly content: string;
  readonly signature: EmailSignature;
}
