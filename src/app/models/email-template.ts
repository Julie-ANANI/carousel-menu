import { EmailSignature } from './email-signature';

export interface EmailTemplate {
  _id?: string;
  step?: string;
  language: string;
  profile?: string;
  subject: string;
  content: string;
  signature?: EmailSignature;
  signatureName?: string;
  status?: string;
  defaultSignatureName?: string;
  modified?: boolean;
  nameWorkflow?: string; // Nom du workflow. On doit l'insérer dans le back end sans changer la route.
}
