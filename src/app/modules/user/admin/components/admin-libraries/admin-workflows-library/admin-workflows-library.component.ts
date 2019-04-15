import { Component, OnInit } from '@angular/core';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailTemplate } from '../../../../../../models/email-template';
import { EmailSignature } from '../../../../../../models/email-signature';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-admin-workflows-library',
  templateUrl: 'admin-workflows-library.component.html',
  styleUrls: ['admin-workflows-library.component.scss']
})

export class AdminWorkflowsLibraryComponent implements OnInit {

  private _newScenarioName: string = null;

  private _scenarioSignature: EmailSignature;

  private _signatures: Array<EmailSignature> = [];

  private _scenarios: Array<EmailScenario> = [];

  private _modalAdd = false;

  constructor(private templatesService: TemplatesService,
              private translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this.getScenarios();

    this.templatesService.getAllSignatures({limit: '0', sort: '{"id":-1}'}).pipe(first()).subscribe((signatures: any) => {
      this._signatures = signatures.result;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });

  }


  public getScenarios() {
    this.templatesService.getAll({limit: '0', sort: '{"id":-1}'}).pipe(first()).subscribe((scenarios: any) => {
      this._scenarios = scenarios.result;
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  private _createEmail(step: string, language: string): EmailTemplate {
    return {
      step: step,
      language: language,
      profile: 'NEW',
      subject: `${step.toLowerCase()} mail - ${language}`,
      content: 'content',
      modified: false,
      nameWorkflow: this._newScenarioName,
      signature: this._scenarioSignature
    }
  }


  onClickAdd() {
    this._modalAdd = true;
  }


  public onClickConfirm() {
    const emails: Array<EmailTemplate> = [];

    const steps = ['FIRST', 'SECOND', 'THIRD', 'THANKS'];

    const languages = ['en', 'fr'];
    steps.forEach((step: string) => {
      languages.forEach((language: string) => {
        emails.push(this._createEmail(step, language));
      });
    });

    this.templatesService.create({name: this._newScenarioName, emails: emails}).pipe(first()).subscribe((newScenario: any) => {
      this._newScenarioName = null;
      this._scenarios.unshift(newScenario);
      this._modalAdd = false;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.WORKFLOW.ADDED');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


  public updateScenario(changedScenario: EmailScenario) {
    this.templatesService.save(changedScenario).pipe(first()).subscribe((updatedScenario: any) => {
      const scenarioIndex: number = this._scenarios.findIndex((scenario: EmailScenario) => scenario._id === changedScenario._id);
      this._scenarios[scenarioIndex] = updatedScenario;
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.WORKFLOW.UPDATED');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }


  /**
   * Suppression et mise à jour de la vue
   */
  public deleteScenario(scenarioToDelete: EmailScenario) {
    this.templatesService.remove(scenarioToDelete._id).pipe(first()).subscribe((_: any) => {
      const scenarioIndex: number = this._scenarios.findIndex((scenario: EmailScenario) => scenario._id === scenarioToDelete._id);
      this._scenarios.splice(scenarioIndex, 1);
      this.translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.CAMPAIGN.WORKFLOW.DELETED');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  get signatures(): Array<EmailSignature> {
    return this._signatures;
  }

  get scenarios(): Array<EmailScenario> {
    return this._scenarios;
  }

  get newScenarioName(): string {
    return this._newScenarioName;
  }

  set newScenarioName(name: string) {
    this._newScenarioName = name;
  }

  get modalAdd(): boolean {
    return this._modalAdd;
  }

  set modalAdd(value: boolean) {
    this._modalAdd = value;
  }

  get scenarioSignature() {
    return this._scenarioSignature;
  }

  public changeScenarioSignature(selection: any) {
    if(selection) {
      this._scenarioSignature = selection;
    }
  }
}
