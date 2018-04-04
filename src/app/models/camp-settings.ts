import { EmailTemplate } from './email-template';
export interface CampaignSettings {
  clonedInfo: boolean;
  emails?: Array<EmailTemplate>,
  readonly emailTemplates: {
    readonly launching: {
      readonly en: {
        readonly subject: string;
        readonly body: string;
      };
      readonly fr: {
        readonly subject: string;
        readonly body: string;
      };
    };
    readonly second: {
      readonly en: {
        readonly subject: string;
        readonly body: string;
      };
      readonly fr: {
        readonly subject: string;
        readonly body: string;
      };
    };
    readonly third: {
      readonly en: {
        readonly subject: string;
        readonly body: string;
      };
      readonly fr: {
        readonly subject: string;
        readonly body: string;
      };
    };
    readonly closing: {
      readonly en: {
        readonly subject: string;
        readonly body: string;
      };
      readonly fr: {
        readonly subject: string;
        readonly body: string;
      };
    };
  };
  readonly signatures: {
    readonly en: {
      readonly signature: string;
    };
    readonly fr: {
      readonly signature: string;
    };
  };
}
