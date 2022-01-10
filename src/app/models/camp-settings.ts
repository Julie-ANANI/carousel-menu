import { EmailTemplate } from './email-template';

export interface CampaignSettingsAB {
  batchA: string,
  batchB: string,
  status: string,
  nameWorkflowA: string,
  nameWorkflowB: string,
}

export interface CampaignSettingsEmailTemplateEntry {
  readonly lang: string;
  readonly launching: {
    subject: string;
    body: string;
  };
  readonly second: {
    subject: string;
    body: string;
  };
  readonly third: {
    subject: string;
    body: string;
  };
  readonly closing: {
    subject: string;
    body: string;
  };
}

export interface CampaignSettingsSignatureEntry {
  readonly lang: string;
  readonly signature: string;
}

// TODO remove multiling
export interface CampaignSettings {
  defaultWorkflow: string;
  clonedInfo: boolean;
  emails?: Array<EmailTemplate>;
  ABsettings?: CampaignSettingsAB;

  /**
   * TODO replace the type with CampaignSettingsEmailTemplateEntry
   */
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

  // TODO replace the type with CampaignSettingsSignatureEntry
  readonly signatures: {
    readonly en: {
      readonly signature: string;
    };
    readonly fr: {
      readonly signature: string;
    };
  };
}
