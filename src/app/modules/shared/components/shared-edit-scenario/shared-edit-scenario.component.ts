import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailScenario } from '../../../../models/email-scenario';
import { EmailTemplate } from '../../../../models/email-template';

@Component({
  selector: 'app-shared-edit-scenario',
  templateUrl: 'shared-edit-scenario.component.html',
  styleUrls: ['shared-edit-scenario.component.scss']
})
export class SharedEditScenarioComponent implements OnInit {

  @Input() scenario: EmailScenario;
  @Input() inCampaign: Boolean;
  @Output() scenarioChange = new EventEmitter <EmailScenario>();
  public displayedLanguages: Array<string> = ['en', 'fr'];
  public displayedProfiles: Array<string> = ['NEW'];
  public availableLanguages: Array<string> = ['en', 'fr'];
  public availableProfiles: Array<string> = ['NEW'];
  public availableScenario: Array<EmailScenario>;
  public isCollapsed: Boolean;
  private _isModified: Boolean;

  constructor() { }

  ngOnInit() {
    /*
    this.availableLanguages = this.scenario.emails.reduce((languages, email) => {
      if (languages.indexOf(email.language) == -1) {
        languages.push(email.language);
      }
      return languages;
    }, []);
    */
  }

  public save(emails: Array<EmailTemplate>, step: string) {
    // On supprime les anciens mails enregistrés pour cette étape
    this.scenario.emails = this.scenario.emails.filter(e => e.step != step);
    // Puis on ajoute les mails mis à jours
    this.scenario.emails = this.scenario.emails.concat(emails).filter(e => e.content);

    this._isModified = this.scenario.emails.reduce((acc, current) => {
      return (acc && current.modified);
    }, true);
    console.log("shared-edit-scenario save")
    console.log(this.scenario)
    this.scenarioChange.emit(this.scenario);
  }

  private _getTemplates(step: string): Array<EmailTemplate> {
    const emails: Array<EmailTemplate> = [];
    this.displayedLanguages.forEach(language => {
      this.displayedProfiles.forEach(profile => {
        emails.push(this._getTemplate(step, profile, language));
      });
    });
    return emails;
  }

  private _getTemplate(step: string, profile: string, language: string): EmailTemplate {
    let template = null;
    let i = 0;
    while (i < this.scenario.emails.length && !template) {
      let email = this.scenario.emails[i];
      i++;
      if (email.step === step && email.profile === profile && email.language === language) {
        template = email;
      }
    }
    template = template || {
        step: step,
        profile: profile,
        language: language,
        subject: "TODO",
        content: "TODO",
        modified: false,
        name: this.scenario.name
      };
    return template;
  }

  public checkLanguage(language: string) {
    const index = this.displayedLanguages.indexOf(language);
    if (index === -1) {
      this.displayedLanguages.push(language);
    } else {
      this.displayedLanguages.splice(index, 1);
    }
  }

  public checkProfile(profile: string) {
    const index = this.displayedProfiles.indexOf(profile);
    if (index === -1) {
      this.displayedProfiles.push(profile);
    } else {
      this.displayedProfiles.splice(index, 1);
    }
  }

  get first(): Array<EmailTemplate> { return this._getTemplates('FIRST'); }
  get second(): Array<EmailTemplate> { return this._getTemplates('SECOND'); }
  get third(): Array<EmailTemplate> { return this._getTemplates('THIRD'); }
  get thanks(): Array<EmailTemplate> { return this._getTemplates('THANKS'); }
}
