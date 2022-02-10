import { EmailTemplate } from './email-template';

export interface CampaignSettingsAB {
  batchA: string,
  batchB: string,
  status: string,
  nameWorkflowA: string,
  nameWorkflowB: string,
}

// TODO remove multiling
export interface CampaignSettings {
  defaultWorkflow: string;
  clonedInfo: boolean;
  emails?: Array<EmailTemplate>;
  ABsettings?: CampaignSettingsAB;

  /**
   * TODO Not using this anymore.
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

  // TODO remove this no idea for this.
  readonly signatures: {
    readonly en: {
      readonly signature: string;
    };
    readonly fr: {
      readonly signature: string;
    };
  };
}
