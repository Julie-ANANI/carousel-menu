import { Injectable } from '@angular/core';
import { EmailTemplate } from "../../models/email-template";
import { EmailSignature } from "../../models/email-signature";

@Injectable({providedIn: 'root'})
export class TemplateFrontService {

  /**
   * create email template object
   * @param step
   * @param language
   * @param scenarioName
   * @param scenarioSignature
   */
  public static createEmail(step: string, language: string, scenarioName?: string, scenarioSignature?: EmailSignature): EmailTemplate {
    return {
      step: step,
      language: language,
      profile: 'NEW',
      subject: `${step.toLowerCase()} mail - ${language}`,
      content: 'content',
      modified: false,
      nameWorkflow: scenarioName || '',
      signature: scenarioSignature
    }
  }
}
