import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailTemplate } from '../../../../../../models/email-template';

@Component({
  selector: 'app-admin-edit-scenario',
  templateUrl: 'admin-edit-scenario.component.html',
  styleUrls: ['admin-edit-scenario.component.scss']
})
export class AdminEditScenarioComponent implements OnInit {

  private _scenario: EmailScenario;
  public deleteModal: boolean = false;
  public displayedLanguages: Array<string> = ['en'];
  public displayedProfiles: Array<string> = ['NEW'];
  public availableLanguages: Array<string> = [];
  public availableProfiles: Array<string> = ['NEW', 'AMBASSADOR'];

  constructor(private _templatesService: TemplatesService,
              private _activatedRoute: ActivatedRoute,
              private _router: Router,
              private _notificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._scenario = this._activatedRoute.snapshot.data['scenario'];
    this.availableLanguages = this._scenario.emails.reduce((languages, email) => {
      if (languages.indexOf(email.language) == -1) {
        languages.push(email.language);
      }
      return languages;
    }, []);
  }

  public save(event: any) {
    this._templatesService.save(this._scenario).first().subscribe(_ => {
      this._notificationsService.success("ERROR.SUCCESS", "ERROR.ACCOUNT.UPDATE");
    }, (err: any) => {
      this._notificationsService.error('ERROR', err);
    });
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
    while (i < this._scenario.emails.length && !template) {
      let email = this._scenario.emails[i];
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
        content: null
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

  /**
   * Suppression et mise à jour de la vue
   */
  public removeScenario() {
    event.preventDefault();
    this._templatesService.remove(this._scenario._id).first().subscribe(_ => {
      this._router.navigate(['/admin/emails/templates']);
    });
  }

  get first(): Array<EmailTemplate> { return this._getTemplates('FIRST'); }
  get second(): Array<EmailTemplate> { return this._getTemplates('SECOND'); }
  get third(): Array<EmailTemplate> { return this._getTemplates('THIRD'); }
  get thanks(): Array<EmailTemplate> { return this._getTemplates('THANKS'); }
  get scenario(): EmailScenario { return this._scenario; }
  set scenario(value: EmailScenario) { this._scenario = value; }
}
