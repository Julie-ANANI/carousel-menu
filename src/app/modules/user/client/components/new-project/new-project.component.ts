import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { TranslateTitleService}  from '../../../../../services/title/title.service';
import { ClientProject } from '../../../../../models/client-project';
import { Mission } from '../../../../../models/mission';
import { TranslateService } from '@ngx-translate/core';
import { CalAnimation, IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { CommonService } from '../../../../../services/common/common.service';
import { ClientProjectService } from '../../../../../services/client-project/client-project.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-project',
  templateUrl: 'new-project.component.html',
  styleUrls: ['new-project.component.scss']
})

export class NewProjectComponent implements OnInit {

  private _currentStep = 0;

  private _fields: Array<string> = ['TITLE', 'PRIMARY_OBJECTIVE', 'SECONDARY_OBJECTIVE', 'RESTITUTION_DATE'];

  private _heading = '';

  private _isLoading = true;

  private _restitutionDate = this._commonService.getFutureMonth();

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

  private _currentLang = this._translateService.currentLang;

  private _isCreating = false;

  // https://github.com/kekeh/angular-mydatepicker
  private _datePickerOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: this._currentLang === 'en' ? 'yyyy-mm-dd' : 'dd-mm-yyyy',
    calendarAnimation: { in: CalAnimation.Fade, out: CalAnimation.Fade} ,
    disableUntil: {
      year: Number(this._restitutionDate.slice(0, 4)),
      month: Number(this._restitutionDate.slice(5, 7)),
      day: Number(this._restitutionDate.slice(8, 10))
    }
  };

  private _milestoneDateComment = '';

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _translateTitleService: TranslateTitleService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _commonService: CommonService,
              private _router: Router,
              private _clientProjectService: ClientProjectService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.NEW_PROJECT');

  }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
    }
  }

  /***
   *
   * @param event
   * @param step
   * @param type
   */
  public changeStep(event: Event, step: number, type: string) {
    event.preventDefault();
    if (type === 'next') { this._clientRoadmap(); }
    this._currentStep = step;
  }

  /***
   * this is to add the current date and step when clicked on the
   * next button and create button.
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
   * when the user selects the date from the date-picker then add
   * the milestoneDate.
   * @param event
   */
  public onDateChanged(event: IMyDateModel) {
    if (event && event.singleDate && event.singleDate.jsDate) {
      this._mission.milestoneDates[0] = {
        name: this._currentLang === 'en' ? 'Restitution Date' : 'Date de restitution',
        code: 'RDO',
        dueDate: event.singleDate.jsDate
      };
    }
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
      lang: this._currentLang,
      domain: environment.domain
    };

    this._clientProjectService.create(this._clientProject, this._mission, newInnovation).pipe(first()).subscribe((response) => {
      this._router.navigate([`/user/projects/${response['innovation']['_id']}/settings`]);
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

  /***
   * based on the conditions of the fields this make the
   * next button disabled/enabled.
   */
  get isDisabled(): boolean {
    switch (this._fields[this._currentStep]) {

      case 'TITLE':
        return !this._clientProject.name;

      case 'PRIMARY_OBJECTIVE':
        return !this._mission.objective.principal[this._currentLang];

      case 'RESTITUTION_DATE':
        return !(this._mission.milestoneDates.length > 0 && this._mission.milestoneDates[0].name);

    }

    return false;
  }

  get currentStep(): number {
    return this._currentStep;
  }

  get fields(): Array<string> {
    return this._fields;
  }

  get heading(): string {
    return this._heading;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get clientProject(): ClientProject {
    return this._clientProject;
  }

  get mission(): Mission {
    return this._mission;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get isCreating(): boolean {
    return this._isCreating;
  }

  get datePickerOptions(): IAngularMyDpOptions {
    return this._datePickerOptions;
  }

  get milestoneDateComment(): string {
    return this._milestoneDateComment;
  }

  set milestoneDateComment(value: string) {
    this._milestoneDateComment = value;
  }

}
