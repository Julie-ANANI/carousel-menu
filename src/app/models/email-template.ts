import { EmailSignature } from './email-signature';

export interface EmailTemplate {
  _id?: string;
  step: string;
  language: string;
  profile: string;
  subject: string;
  content: string;
  signature?: EmailSignature;
  modified: boolean;
  nameWorkflow: string; // Nom du workflow. On doit l'inserer dans le back end sans changer la route.
}
