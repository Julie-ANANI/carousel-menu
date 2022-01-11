import { EmailTemplate } from './email-template';

export interface CampaignSettingsAB {
  batchA: string,
  batchB: string,
  status: string,
  nameWorkflowA: string,
  nameWorkflowB: string,
}

export interface CampaignSettingsEntry {
  readonly lang: string;
  readonly signature: string;
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

// TODO remove multiling
export interface CampaignSettings {
  defaultWorkflow: string;
  clonedInfo: boolean;
  emails?: Array<EmailTemplate>;
  ABsettings?: CampaignSettingsAB;
  entry?: Array<CampaignSettingsEntry>;

  /**
   * TODO remove this.
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

  // TODO remove this.
  readonly signatures: {
    readonly en: {
      readonly signature: string;
    };
    readonly fr: {
      readonly signature: string;
    };
  };
}
