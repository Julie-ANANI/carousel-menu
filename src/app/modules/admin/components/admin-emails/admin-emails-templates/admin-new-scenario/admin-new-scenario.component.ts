import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EmailTemplate } from '../../../../../../models/email-template';
import { TemplatesService } from '../../../../../../services/templates/templates.service';

@Component({
  selector: 'app-admin-new-scenario',
  templateUrl: 'admin-new-scenario.component.html',
  styleUrls: ['admin-new-scenario.component.scss']
})
export class AdminNewScenarioComponent {

  private _newScenarioName: string = null;
  private _newSignatureName: string = null;

  constructor(private _templatesService: TemplatesService,
              private _router: Router) { }

  public createScenario() {
    const emails: Array<EmailTemplate> = [
      {
        step: "FIRST",
        language: 'en',
        profile: 'NEW',
        subject: 'first mail',
        content: 'content'
      },
      {
        step: "SECOND",
        language: 'en',
        profile: 'NEW',
        subject: 'second mail',
        content: 'content'
      },
      {
        step: "THIRD",
        language: 'en',
        profile: 'NEW',
        subject: 'last mail',
        content: 'content'
      },
      {
        step: "THANKS",
        language: 'en',
        profile: 'NEW',
        subject: 'thanks',
        content: 'content'
      }
    ];
    this._templatesService.create({name: this._newScenarioName, emails: emails}).first().subscribe(newScenario => {
      this._router.navigate(['/admin/emails/templates/scenario/' + newScenario._id])
    });
  }

  public createSignature() {
    this._templatesService.createSignature({name: this._newSignatureName}).first().subscribe(newSignature => {
      this._router.navigate(['/admin/emails/templates/signature/' + newSignature._id])
    });
  }

  get newScenarioName(): string { return this._newScenarioName; }
  get newSignatureName(): string { return this._newSignatureName; }
  set newScenarioName(name: string) { this._newScenarioName = name; }
  set newSignatureName(name: string) { this._newSignatureName = name; }
}
