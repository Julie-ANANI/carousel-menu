import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { TemplatesService } from '../../../../../../services/templates/templates.service';
import { TranslateNotificationsService } from '../../../../../../services/translate-notifications/translate-notifications.service';
import { EmailScenario } from '../../../../../../models/email-scenario';
import { EmailTemplate } from '../../../../../../models/email-template';
import { EmailSignature } from '../../../../../../models/email-signature';
import { first } from 'rxjs/operators';
import { RolesFrontService } from "../../../../../../services/roles/roles-front.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../../../services/error/error-front.service";
import { isPlatformBrowser } from "@angular/common";
import { Response } from "../../../../../../models/response";
import {UmiusConfigInterface, UmiusLocalStorageService} from '@umius/umi-common-component';

@Component({
  templateUrl: 'admin-libraries-workflows.component.html',
})

export class AdminLibrariesWorkflowsComponent implements OnInit {

  private _workflowTemplateLanguages = ['en', 'fr', 'es', 'de', 'pt', 'it', 'nl'];

  private _newScenarioName = '';

  private _scenarioSignature: EmailSignature = <EmailSignature>{};

  private _signatures: Array<EmailSignature> = [];

  private _scenarios: Array<EmailScenario> = [];

  private _modalAdd = false;

  private _isLoading = true;

  private _fetchingError = false;

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '0',
    sort: '{"id":-1}',
    offset: '0',
    search: '{}',
  };

  private _isAdding = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _templatesService: TemplatesService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _localStorageService: UmiusLocalStorageService) {
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._getAllScenarios().then(() => {
        this._getAllSignatures();
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._isLoading = false;
        this._fetchingError = true;
        console.error(err);
      });
    }
  }

  private _getAllSignatures() {
    this._localStorageService.setItem('allSignatures', '');
    const signatures = this._localStorageService.getItem('allSignatures') && JSON.parse(this._localStorageService.getItem('allSignatures'));
    if (signatures) {
      this._signatures = signatures.result;
    } else {
      this._templatesService.getAllSignatures(this._config).pipe(first()).subscribe((response: Response) => {
        this._isLoading = false;
        this._signatures = response && response.result;
        this._localStorageService.setItem('allSignatures',  JSON.stringify(response));
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._isLoading = false;
        this._fetchingError = true;
        console.error(err);
      });
    }
  }

  private _getAllScenarios() {
    return new Promise((resolve, reject) => {
      this._templatesService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._scenarios = response && response.result;
        resolve(true);
      }, (err: HttpErrorResponse) => {
        reject(err);
      });
    });
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'workflows'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['libraries', 'workflows']);
    }
  }

  public onClickAdd() {
    this._modalAdd = true;
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

  public onClickConfirm() {
    if (!this._isAdding) {
      this._isAdding = true;
      const emails: Array<EmailTemplate> = [];
      const steps = ['FIRST', 'SECOND', 'THIRD', 'THANKS'];
      steps.forEach((step: string) => {
        this._workflowTemplateLanguages.forEach((language: string) => {
          emails.push(this._createEmail(step, language));
        });
      });

      this._templatesService.create({name: this._newScenarioName, emails: emails}).pipe(first())
        .subscribe((newScenario: EmailScenario) => {
          this._newScenarioName = null;
          this._scenarios.unshift(newScenario);
          this._translateNotificationsService.success('Success', 'The workflow is added.');
          this._modalAdd = false;
          this._isAdding = false;
        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          this._isAdding = false;
          console.error(err);
        });
    }
  }

  public changeScenarioSignature(selection: any) {
    if (selection) {
      this._scenarioSignature = selection;
    }
  }

  public updateScenario(changedScenario: EmailScenario) {
    this._templatesService.save(changedScenario).pipe(first()).subscribe((updatedScenario: any) => {
      const scenarioIndex: number = this._scenarios.findIndex((scenario: EmailScenario) =>
        scenario._id === changedScenario._id);
      this._scenarios[scenarioIndex] = updatedScenario;
      this._translateNotificationsService.success('Success', 'The workflow is updated.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  /**
   * Suppression et mise à jour de la vue
   */
  public deleteScenario(scenarioToDelete: EmailScenario) {
    this._templatesService.remove(scenarioToDelete._id).pipe(first()).subscribe((_: any) => {
      const scenarioIndex: number = this._scenarios.findIndex((scenario: EmailScenario) =>
        scenario._id === scenarioToDelete._id);
      this._scenarios.splice(scenarioIndex, 1);
      this._translateNotificationsService.success('Success', 'The workflow is deleted.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
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

  get isLoading(): boolean {
    return this._isLoading;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get workflowTemplateLanguages(): string[] {
    return this._workflowTemplateLanguages;
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

  get isAdding(): boolean {
    return this._isAdding;
  }

}
