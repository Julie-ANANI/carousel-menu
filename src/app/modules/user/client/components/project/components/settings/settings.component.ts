import { Component, OnDestroy, OnInit } from '@angular/core';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../../models/innovation';
import { Mission } from '../../../../../../../models/mission';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ClientProject } from '../../../../../../../models/client-project';
import { Router } from '@angular/router';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../../../services/error/error-front';
import { MissionService } from '../../../../../../../services/mission/mission.service';
import { CalAnimation, IAngularMyDpOptions, IMyDateModel } from 'angular-mydatepicker';
import { UserService } from '../../../../../../../services/user/user.service';

interface Section {
  name: string;
  isVisible: boolean;
  isEditable: boolean;
  level: 'CLIENT_PROJECT' | 'MISSION' | 'INNOVATION'
}

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _clientProject: ClientProject = <ClientProject>{};

  private _isAdmin = this._authService.isAdmin;

  private _currentLang = this._translateService.currentLang;

  activeView = 'TITLE';

  private _dateFormat = this._currentLang === 'en' ? 'y/MM/dd' : 'dd/MM/y';

  private _sections: Array<Section> = [
    { name: 'TITLE', isVisible: false, isEditable: false, level: 'INNOVATION' },
    { name: 'PRINCIPAL_OBJECTIVE', isVisible: false, isEditable: false, level: 'MISSION' },
    { name: 'SECONDARY_OBJECTIVE', isVisible: false, isEditable: false, level: 'MISSION' },
    { name: 'ROADMAP', isVisible: false, isEditable: !!(this._isAdmin) , level: 'MISSION' },
    { name: 'RESTITUTION_DATE', isVisible: false, isEditable: false, level: 'MISSION' },
    { name: 'OWNER', isVisible: false, isEditable: !!(this._isAdmin), level: 'INNOVATION' },
    { name: 'COLLABORATORS', isVisible: true, isEditable: true, level: 'INNOVATION' },
    { name: 'OPERATOR', isVisible: false, isEditable: !!(this._isAdmin), level: 'INNOVATION' },
    { name: 'COMMERCIAL', isVisible: false, isEditable: !!(this._isAdmin), level: 'CLIENT_PROJECT' },
    { name: 'LANGUAGE', isVisible: false, isEditable: false, level: 'INNOVATION' },
    { name: 'AUTHORISATION', isVisible: false, isEditable: false, level: 'MISSION' },
  ];

  private _showModal = false;

  activeModalSection: Section = <Section>{};

  valueToUpdate: any = '';

  datePickerOptions: IAngularMyDpOptions = <IAngularMyDpOptions>{};

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private _authService: AuthService,
              private _translateService: TranslateService,
              private _router: Router,
              private _innovationService: InnovationService,
              private _userService: UserService,
              private _missionService: MissionService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) { }

  ngOnInit() {

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      console.log(innovation);

      if (<Mission>this._innovation.mission && (<Mission>this._innovation.mission)._id) {
        this._mission = <Mission>this._innovation.mission;
      }

      if (<ClientProject>this._innovation.clientProject && (<Mission>this._innovation.clientProject)._id) {
        this._clientProject = <ClientProject>this._innovation.clientProject;
      }

      this._initSections();
    });

  }

  /***
   * based on the innovation we initialize the sections. We also check here which section
   * to make visible and editable.
   * @private
   */
  private _initSections() {
    if (this._innovation && this._innovation.status) {
      this._sections.forEach((section) => {
        switch (section.name) {

          case 'TITLE':
            section.isVisible = !!this._innovation.name;
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'PRINCIPAL_OBJECTIVE':
            section.isVisible = !!(this._mission.objective && this._mission.objective.principal
              && this._mission.objective.principal[this._currentLang]);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'SECONDARY_OBJECTIVE':
            section.isVisible = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED')
              || !!(this._mission.objective && this._mission.objective.principal && this._mission.objective.secondary[this._currentLang]);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'OWNER':
            section.isVisible = !!(this._innovation.owner);
            break;

          case 'OPERATOR':
            section.isVisible = !!(this._isAdmin) || !!(this._innovation.operator && this._innovation.operator.id);
            break;

          case 'COMMERCIAL':
            section.isVisible = !!(this._isAdmin) || !!(this._clientProject.commercial);
            break;

          case 'RESTITUTION_DATE':
            section.isVisible = !!(this._mission.milestoneDates && this._mission.milestoneDates.length > 0
              && this._mission.milestoneDates.some((milestone) => milestone.code === 'RDO'));
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

          case 'ROADMAP':
            section.isVisible = !!(this._mission.milestoneDates && this._mission.milestoneDates.length > 0);
            /* Todo uncomment
            section.isVisible = !!(this._mission.milestoneDates && this._mission.milestoneDates.length > 0
              && this._mission.milestoneDates.some((milestone) => milestone.code !== 'RDO'));
             */
            break;

          case 'LANGUAGE':
            section.isVisible = !!(this._innovation.innovationCards && this._innovation.innovationCards.length > 0);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED') || !!(this._isAdmin);
            break;

          case 'AUTHORISATION':
            section.isVisible = !!(this._mission.externalDiffusion);
            section.isEditable = !!(this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
            break;

        }
      });
    }
  }

  public navigateToSection(name: string) {
    this.activeView = name;
    this._router.navigate([`/user/projects/${this._innovation._id}/settings`], { fragment: name.toLowerCase() });
  }

  /***
   * when the user clicks on the Edit button we open the modal and also check
   * the isEditable property of that section.
   * @param event
   * @param section
   */
  public openModal(event: Event, section: Section) {
    event.preventDefault();

    if (section.isEditable) {
      this.valueToUpdate = '';
      this.activeModalSection = section;
      this._initActiveModalValue();
      this._showModal = true;
    }

  }

  /***
   * based on the section Edit button click we initialize
   * the valueToUpdate with the default value.
   * @private
   */
  private _initActiveModalValue() {
    switch (this.activeModalSection.name) {

      case 'TITLE':
        this.valueToUpdate = this._innovation.name;
        break;

      case 'PRINCIPAL_OBJECTIVE':
        this.valueToUpdate = this._mission.objective.principal;
        break;

    }
  }

  /***
   * when the user clicks on the cancel button in the modal.
   */
  public closeModal() {
    this._showModal = false;
    this.activeModalSection = <Section>{};
  }

  public onClickSaveModal(event: Event) {
    event.preventDefault();

    switch (this.activeModalSection.level) {

      case 'INNOVATION':
        this._updateInnovation();
        break;

      case 'MISSION':
        this._updateMission();
        break;

    }

  }

  /***
   * this updates the innovation object, and based on the activeModalSection it assign the value
   * that user wants to update and call the service.
   * @private
   */
  private _updateInnovation() {

    switch (this.activeModalSection.name) {

      case 'TITLE':
        this._innovation.name = this.valueToUpdate;
        break;

      case 'OWNER':
        this._innovation.owner = this.valueToUpdate;
        break;

    }

    this._innovationService.save(this._innovation._id, this._innovation).pipe(first()).subscribe((innovation) => {

      if (this.activeModalSection.name === 'OWNER') {
        this._getUser()
      } else {
        this._innovationFrontService.setInnovation(innovation);
      }

      this.closeModal();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');

    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });

  }

  /***
   * this updates the mission object, and based on the activeModalSection it assign the value
   * that user wants to update nad call the service.
   * @private
   */
  private _updateMission() {

    switch (this.activeModalSection.name) {

      case 'PRINCIPAL_OBJECTIVE':
        this._mission.objective.principal = this.valueToUpdate;
        if (this._mission.objective.principal['en'] === 'Other') {
          this._mission.objective.secondary = [];
        }
        break;

    }

    this._missionService.save(this._mission._id, this._mission).pipe(first()).subscribe((mission) => {
      this._innovation.mission = mission;
      this._innovationFrontService.setInnovation(this._innovation);
      this.closeModal();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    })

  }

  /***
   * when the user changes the secondary objectives.
   * @param objectives
   * @param section
   */
  public onChangeSecondaryObjective(objectives: Array<any>, section: Section) {
    if (this.enableSecondaryObjectives(section)) {
      this._mission.objective.secondary = objectives;
      this._updateMission();
    }
  }

  /***
   * when the user changes the comment of secondary objectives.
   * @param comment
   * @param section
   */
  public onChangeComment(comment: string, section: Section) {
    if (section.isEditable) {
      this._mission.objective.comment = comment;
      this._updateMission();
    }
  }

  /***
   * when the user clicks on the Edit button to change the Restitution date.
   */
  public editRestitutionDate() {
    const index = this._mission.milestoneDates.findIndex((milestone) => milestone.code === 'RDO');
    if (index !== -1) {
      const date = new Date(this._mission.milestoneDates[index].dueDate).toISOString();
      this.datePickerOptions = {
        dateRange: false,
        dateFormat: this._currentLang === 'en' ? 'yyyy-mm-dd' : 'dd-mm-yyyy',
        calendarAnimation: { in: CalAnimation.Fade, out: CalAnimation.Fade},
        disableUntil: {
          year: Number(date.slice(0, 4)),
          month: Number(date.slice(5, 7)),
          day: Number(date.slice(8, 10))
        }
      };
    }
  }

  /***
   * when the user selects the restitution date from the date-picker.
   * @param event
   */
  public onChangeRestitutionDate(event: IMyDateModel) {
    const index = this._mission.milestoneDates.findIndex((milestone) => milestone.code === 'RDO');
    if (event && event.singleDate && event.singleDate.jsDate && index !== -1) {

      this._mission.milestoneDates[index] = {
        name: this._currentLang === 'en' ? 'Restitution Date' : 'Date de restitution',
        code: 'RDO',
        dueDate: event.singleDate.jsDate
      };

      this._updateMission();

    }
  }

  /***
   * getting the value form autosuggestion.
   * @param value
   */
  public changeOwner(value: any) {
    if (value._id) {
      this.valueToUpdate = value;
    }
  }

  /***
   * based on the id we get the user form the back and assign it to
   * the innovation owner.
   * @private
   */
  private _getUser() {
    this._userService.get(this.valueToUpdate._id).pipe(first()).subscribe((user) => {
      this._innovation.owner = user;
      this._innovationFrontService.setInnovation(this._innovation);
      }, (err: HttpErrorResponse) => {
      console.log(err);
    });
  }

  /***
   * if the value of the mission principal objective is 'Other' then
   * we disabled the mission secondary objectives.
   */
  public enableSecondaryObjectives(section: Section): boolean {
    return this._mission.objective && this._mission.objective.principal
      && this._mission.objective.principal['en'] !== 'Other' && section.isEditable;
  }

  /***
   * based on the activeModalSection value, it checks for
   * save button disable condition.
   */
  get isSaveDisabled(): boolean {
    switch (this.activeModalSection.name) {

      case 'TITLE':
      case 'OWNER':
        return !this.valueToUpdate;

    }

    return false;
  }

  get mission(): Mission {
    return this._mission;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get clientProject(): ClientProject {
    return this._clientProject;
  }

  get sections(): Array<Section> {
    return this._sections;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get dateFormat(): string {
    return this._dateFormat;
  }

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
