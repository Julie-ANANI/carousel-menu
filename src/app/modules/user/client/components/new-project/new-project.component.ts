import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { TranslateTitleService} from '../../../../../services/title/title.service';
import { ClientProject } from '../../../../../models/client-project';
import {Mission, MissionTemplate} from '../../../../../models/mission';
import { TranslateService } from '@ngx-translate/core';
import { ClientProjectService } from '../../../../../services/client-project/client-project.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { Router } from '@angular/router';
import {AuthService} from '../../../../../services/auth/auth.service';
import {NewInnovation} from '../../../../../models/innovation';
import {MissionService} from '../../../../../services/mission/mission.service';
import {isPlatformBrowser} from '@angular/common';
import {Consent} from '../../../../../models/consent';

@Component({
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})

export class NewProjectComponent implements OnInit, OnDestroy {

  get restitutionDate(): Date {
    return this._restitutionDate;
  }

  get missionTemplates(): Array<MissionTemplate> {
    return this._missionTemplates;
  }

  /***
   * based on the conditions of the fields this make the
   * next button disabled/enabled.
   */
  get isDisabled(): boolean {
    switch (this._fields[this._currentStep]) {
      case 'STEP_1':
        return !(this._mission.template && this._mission.template._id);

      case 'STEP_LAST':
        return !(this._hasRestitutionDate() && !!this._clientProject.name && this._verifyCollaboratorsConsent());
    }

    return false;
  }

  get buttonId(): string {
    switch (this._fields[this._currentStep]) {
      case 'STEP_0':
        return 'new-project-btn-step-welcome';
      case 'STEP_1':
        return 'new-project-btn-step-template';
      case 'STEP_LAST':
        return 'new-project-btn-step-create-market-test';
      default:
        return 'new-project-btn-' + this._fields[this._currentStep].toLowerCase();
    }
  }

  get currentStep(): number {
    return this._currentStep;
  }

  get fields(): Array<string> {
    return this._fields;
  }

  get clientProject(): ClientProject {
    return this._clientProject;
  }

  get mission(): Mission {
    return this._mission;
  }

  get isCreating(): boolean {
    return this._isCreating;
  }

  get milestoneDateComment(): string {
    return this._milestoneDateComment;
  }

  set milestoneDateComment(value: string) {
    this._milestoneDateComment = value;
  }

  get reportingLang(): string {
    return this._reportingLang;
  }

  set reportingLang(value: string) {
    this._reportingLang = value;
  }

  get collaboratorsConsent(): Consent {
    return this._collaboratorsConsent;
  }

  set collaboratorsConsent(value: Consent) {
    this._collaboratorsConsent = value;
  }

  get collaborators(): Array<string> {
    return this._collaborators;
  }

  set collaborators(value: Array<string>) {
    this._collaborators = value;
  }

  get isNextStep(): boolean {
    return this._isNextStep;
  }

  private _currentStep = 0;

  private _fields: Array<string> = ['STEP_0', 'STEP_1', 'STEP_LAST'];

  private _clientProject: ClientProject = {
    name: '',
    roadmapDates: []
  };

  /**
   * by default we assign index 0 to the first emails send.
   * @private
   */
  private _mission: Mission = {
    name: '',
    milestoneDates: [
      {
        name: 'Feedback collection',
        code: 'FC0',
        dueDate: null
      }
    ]
  };

  private _isCreating = false;

  private _isNextStep = false;

  private _milestoneDateComment = '';

  private _nextStepTimeout: any = null;

  private _reportingLang = '';

  private _collaboratorsConsent: Consent = <Consent>{};

  private _collaborators: Array<string> = [];

  private _missionTemplates: Array<MissionTemplate> = [];

  private _restitutionDate: Date = new Date();

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _missionService: MissionService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router,
              private _clientProjectService: ClientProjectService,
              private _authService: AuthService) {
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NEW_PROJECT');
  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._getAllMissionTemplates();
    }
  }

  /**
   * get all the use cases mission templates from the back.
   * @private
   */
  private _getAllMissionTemplates() {
    this._missionService.getAllTemplates().pipe(first()).subscribe((response) => {
      if (response && response.result && response.result.length) {
        this._missionTemplates = response.result;
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  /**
   * will receive the selected mission template
   * @param event
   */
  public onChangeMissionTemplate(event: MissionTemplate) {
    this._mission.template = event;
  }

  /**
   * when the user selects the date from the date-picker then add
   * the milestoneDate.
   * @param event
   */
  public onChangeRestitutionDate(event: Date) {
    if (!!event) {
      this._restitutionDate = event;
      this._mission.milestoneDates[1] = {
        name: 'Restitution date',
        code: 'RDO',
        dueDate: event
      };
    }
  }

  /***
   * this is to add the current date and step when clicked on the
   * main action buttons.
   * @private
   */
  private _clientRoadmap() {
    this._clientProject.roadmapDates[this._currentStep] = {
      name: this._stepName(),
      code: 'NEW_PROJECT',
      date: new Date()
    };
  }

  private _stepName() {
    switch (this._currentStep) {
      case 0:
        return 'Step welcome';

      case 1:
        return 'Step template';

      case (this._fields.length - 1):
        return 'Create';
    }
  }

  /***
   * when the user clicks on the create button.
   */
  private _createProject() {
    this._isCreating = true;
    this._mission.name = this._clientProject.name;

    /**
     * assign comment to milestone date === Restitution date.
     */
    if (!!this._milestoneDateComment) {
      const index = this._mission.milestoneDates.findIndex((milestone) => milestone.code === 'RDO');
      if (index !== -1) {
        this._mission.milestoneDates[index].comment = this._milestoneDateComment;
      }
    }

    // innovation attributes
    const newInnovation: NewInnovation = {
      name: this._clientProject.name,
      lang: this._translateService.currentLang,
      reportingLang: this._reportingLang,
      domain: environment.domain
    };

    if (this._collaborators.length) {
      newInnovation['collaborators'] = this._collaborators;
      newInnovation['collaboratorsConsent'] = this._collaboratorsConsent;
    }

    this._clientProjectService.create(this._clientProject, this._mission, newInnovation)
      .pipe(first())
      .subscribe((response) => {
        // Reload session to refresh etherpad cookies and accesses for this new project
        this._authService.initializeSession().pipe(first()).subscribe(() => {
          this._router.navigate([`/user/projects/${response['innovation']['_id']}/settings`]);
        });
        }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        this._isCreating = false;
        console.error(err);
      });
  }

  public goToBackStep(event: Event) {
    event.preventDefault();
    this._currentStep--;
  }

  public goToNextStep(event: Event) {
    event.preventDefault();

    if (!this.isDisabled) {
      this._clientRoadmap();

      /***
       * this is the finale step to create the new project.
       */
      if (this._fields[this._currentStep] === 'STEP_LAST') {
        this._createProject();
      } else {
        this._isNextStep = true;
        this._nextStepTimeout = setTimeout(() => {
          this._currentStep++;
          this._isNextStep = false;
        }, 250);
      }
    }
  }

  private _hasRestitutionDate(): boolean {
    if (this._mission.milestoneDates && this._mission.milestoneDates.length) {
      return !!(this._mission.milestoneDates.some((milestone) => milestone.code === 'RDO'));
    }
    return false;
  }

  /**
   * this is to check if collaborators are added then consent should be accepted.
   * @private
   */
  private _verifyCollaboratorsConsent(): boolean {
    return this._collaborators.length ? this._collaboratorsConsent.value : true;
  }

  ngOnDestroy(): void {
    clearTimeout(this._nextStepTimeout);
  }

}
