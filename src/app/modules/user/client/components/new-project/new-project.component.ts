import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { TranslateTitleService} from '../../../../../services/title/title.service';
import { ClientProject } from '../../../../../models/client-project';
import { Mission } from '../../../../../models/mission';
import { TranslateService } from '@ngx-translate/core';
import { ClientProjectService } from '../../../../../services/client-project/client-project.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { Router } from '@angular/router';
import {AuthService} from '../../../../../services/auth/auth.service';
import {Consent} from '../../../../../models/innovation';

@Component({
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})

export class NewProjectComponent implements OnInit, OnDestroy {

  private _currentStep = 0;

  private _fields: Array<string> = ['STEP_0', 'STEP_1', 'STEP_LAST'];

  private _clientProject: ClientProject = {
    name: '',
    roadmapDates: []
  };

  private _mission: Mission = {
    name: '',
    objective: {
      principal: { en: '', fr: '' },
      secondary: [],
      comment: ''
    },
    milestoneDates: []
  };

  private _isCreating = false;

  private _isNextStep = false;

  private _milestoneDateComment = '';

  private _nextStepTimeout: any = null;

  private _projectLang = this._translateService.currentLang;

  private _collaboratorsConsent: Consent = <Consent>{};

  private _collaborators: Array<string> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _router: Router,
              private _clientProjectService: ClientProjectService,
              private _authService: AuthService) {
    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NEW_PROJECT');
  }

  ngOnInit() {
  }

  /***
   * will receive this from the textarea filed after the restitution date
   * @param value
   */
  public onChangeDateComment(value: string) {
    this._milestoneDateComment = value;
  }

  /***
   * project title and we assign to it the client project and mission name also.
   * @param value
   */
  public onChangeProjectName(value: string) {
    this._clientProject.name = value;
    this._mission.name = value;
  }

  /**
   * when toggle the collaborators consent checkbox.
   * @param value
   */
  public onChangeCollaboratorsConsent(value: Consent) {
   this._collaboratorsConsent = value;
  }

  /**
   * users email to send the invitation to be part of this project.
   * @param value
   */
  public onChangeCollaborators(value: Array<string>) {
    this._collaborators = value;
  }

  /**
   * when the user selects the date from the date-picker then add
   * the milestoneDate.
   * @param event
   */
  public onChangeRestitutionDate(event: Date) {
    if (!!event) {
      this._mission.milestoneDates[0] = {
        name: 'Feedback collection',
        code: 'FC0',
        dueDate: null
      };
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
      name: this._currentStep === (this._fields.length - 1) ? 'Create' : 'Step ' + (this._currentStep + 1),
      code: 'NEW_PROJECT',
      date: new Date()
    };
  }

  /***
   * when the user clicks on the create button.
   * @param event
   */
  public createProject(event: Event) {
    event.preventDefault();
    this._isCreating = true;

    // client project attribute
    this._clientRoadmap();

    // mission attribute
    this._mission.name = this._clientProject.name;
    this._mission.milestoneDates[0].comment = this._milestoneDateComment;

    // innovation attributes
    const newInnovation = {
      name: this._clientProject.name,
      lang: this._projectLang,
      domain: environment.domain
    };

    this._clientProjectService.create(this._clientProject, this._mission, newInnovation).pipe(first()).subscribe((response) => {
      // Reload session to refresh etherpad cookies and accesses for this new project
      this._authService.initializeSession().subscribe(() => {
        this._router.navigate([`/user/projects/${response['innovation']['_id']}/settings`]);
      });
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._isCreating = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });

  }

  /***
   * if the value of the mission principal objective is 'Other' then
   * we disabled the mission secondary objectives also assign it with [].
   */
  public enableSecondaryObjectives(): boolean {
    if (this._mission.objective.principal['en'] === 'Other') {
      this._mission.objective.secondary = [];
    }
    return this._mission.objective.principal['en'] !== 'Other';
  }

  public goToNextStep(event: Event) {
    event.preventDefault();

    if (!this.isDisabled) {
      this._clientRoadmap();

      /***
       * this is the finale step to create the new project.
       */
      if (this._fields[this._currentStep] === 'STEP_LAST') {

      } else {
        this._isNextStep = true;
        this._nextStepTimeout = setTimeout(() => {
          this._currentStep++;
          this._isNextStep = false;
        }, 250);
      }
    }
  }

  /***
   * based on the conditions of the fields this make the
   * next button disabled/enabled.
   */
  get isDisabled(): boolean {
    switch (this._fields[this._currentStep]) {
      case 'STEP_1':
        return false;

      case 'STEP_LAST':
        return false;

      /*case 'TITLE':
        return !this._clientProject.name;

      case 'PRIMARY_OBJECTIVE':
        return !this._mission.objective.principal[this._currentLang];

      case 'RESTITUTION_DATE':
        return !(this._mission.milestoneDates.length > 0 && this._mission.milestoneDates[0].name);*/

    }

    return false;
  }

  get buttonId(): string {
    switch (this._fields[this._currentStep]) {
      case 'STEP_0':
        return 'new-project-btn-step-welcome';
      case 'STEP_1':
        return 'new-project-btn-step-objectives';
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

  get projectLang(): string {
    return this._projectLang;
  }

  set projectLang(value: string) {
    this._projectLang = value;
  }

  get collaboratorsConsent(): Consent {
    return this._collaboratorsConsent;
  }

  get collaborators(): Array<string> {
    return this._collaborators;
  }

  get isNextStep(): boolean {
    return this._isNextStep;
  }

  ngOnDestroy(): void {
    clearTimeout(this._nextStepTimeout);
  }

}
