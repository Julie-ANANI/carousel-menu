import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { Innovation } from '../../../../../../../models/innovation';
import { Mission } from '../../../../../../../models/mission';
import { first, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AuthService } from '../../../../../../../services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ClientProject } from '../../../../../../../models/client-project';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../../../services/error/error-front.service';
import { MissionService } from '../../../../../../../services/mission/mission.service';
import {
  CalAnimation,
  IAngularMyDpOptions,
  IMyDateModel,
} from 'angular-mydatepicker';
import { emailRegEx } from '../../../../../../../utils/regex';
import { Collaborator } from '../../../../../../../models/collaborator';
import { User } from '../../../../../../../models/user.model';
import { InnovCard } from '../../../../../../../models/innov-card';
import { MissionFrontService } from '../../../../../../../services/mission/mission-front.service';

interface Section {
  name: string;
  isVisible: boolean;
  isEditable: boolean;
  level: 'CLIENT_PROJECT' | 'MISSION' | 'INNOVATION' | 'COLLABORATOR' | 'ALL';
  field?: string;
}

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{
    objective: {
      principal: { en: '', fr: '' },
      secondary: [],
      comment: '',
    },
    milestoneDates: [],
  };

  private _clientProject: ClientProject = <ClientProject>{};

  private _isAdmin = this._authService.isAdmin;

  private _currentLang = this._translateService.currentLang;

  private _activeView = 'TITLE';

  private _dateFormat = this._currentLang === 'en' ? 'y/MM/dd' : 'dd/MM/y';

  private _collaboratorConsent = false;

  private _sections: Array<Section> = [
    { name: 'TITLE', isVisible: false, isEditable: true, level: 'INNOVATION' },
    {
      name: 'PRINCIPAL_OBJECTIVE',
      isVisible: false,
      isEditable: false,
      level: 'MISSION',
    },
    {
      name: 'SECONDARY_OBJECTIVE',
      isVisible: false,
      isEditable: false,
      level: 'MISSION',
    },
    { name: 'ROADMAP', isVisible: false, isEditable: false, level: 'MISSION' },
    {
      name: 'RESTITUTION_DATE',
      isVisible: false,
      isEditable: false,
      level: 'MISSION',
    },
    { name: 'OWNER', isVisible: false, isEditable: false, level: 'ALL' },
    {
      name: 'COLLABORATORS',
      isVisible: true,
      isEditable: true,
      level: 'COLLABORATOR',
    },
    {
      name: 'OPERATOR',
      isVisible: false,
      isEditable: false,
      level: 'INNOVATION',
    },
    {
      name: 'COMMERCIAL',
      isVisible: false,
      isEditable: false,
      level: 'CLIENT_PROJECT',
    },
    {
      name: 'LANGUAGE',
      isVisible: false,
      isEditable: false,
      level: 'INNOVATION',
    },
    {
      name: 'AUTHORISATION',
      isVisible: false,
      isEditable: true,
      level: 'MISSION',
    },
  ];

  private _showModal = false;

  private _activeModalSection: Section = <Section>{};

  private _selectedValue: any = '';

  private _datePickerOptions: IAngularMyDpOptions = <IAngularMyDpOptions>{};

  private _isSaving = false;

  private _showDeleteModal = false;

  private _isDeleting = false;

  private _isVisibleMenu = true;

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _tabClicked = false;

  constructor(
    private _authService: AuthService,
    private _translateService: TranslateService,
    private _innovationService: InnovationService,
    private _missionService: MissionService,
    private _translateNotificationsService: TranslateNotificationsService,
    private _innovationFrontService: InnovationFrontService
  ) {}

  ngOnInit() {
    this._innovationFrontService
      .innovation()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((innovation) => {
        this._innovation = innovation;

        if (
          <Mission>this._innovation.mission &&
          (<Mission>this._innovation.mission)._id
        ) {
          this._mission = <Mission>this._innovation.mission;
          if (this._mission.milestoneDates.length > 1) {
            this._mission.milestoneDates = MissionFrontService.sortMilestoneDates(
              this._mission.milestoneDates
            );
          }
        }

        if (
          <ClientProject>this._innovation.clientProject &&
          (<Mission>this._innovation.clientProject)._id
        ) {
          this._clientProject = <ClientProject>this._innovation.clientProject;
        }

        this._initSections();
      });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this._tabClicked) {
      const _pageOffset = window.pageYOffset;
      if (_pageOffset > 0) {
        this._sections.forEach((section, index) => {
          const _element = document.getElementById(section.name.toLowerCase());
          if (_element) {
            const _elementOffset = _element.offsetTop;
            if (
              _elementOffset - _pageOffset > -1 &&
              _elementOffset - _pageOffset < 50
            ) {
              this._activeView = section.name;
            }
          }
        });
      } else {
        this._activeView = this._sections[0].name;
      }
    }
  }

  /***
   * fired when the scroll end.
   */
  public scrollEnd() {
    this._tabClicked = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: Event) {
    this._isVisibleMenu = window.innerWidth >= 840;
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
            break;

          case 'PRINCIPAL_OBJECTIVE':
            section.isVisible = !!this._mission.objective.principal[
              this._currentLang
            ];
            section.isEditable = !!(
              this._innovation.status === 'EDITING' ||
              this._innovation.status === 'SUBMITTED'
            );
            break;

          case 'SECONDARY_OBJECTIVE':
            section.isVisible =
              !!(
                this._mission.objective.principal[this._currentLang] &&
                (this._innovation.status === 'EDITING' ||
                  this._innovation.status === 'SUBMITTED')
              ) ||
              !!(
                this._mission.objective.secondary.length ||
                this._mission.objective.comment
              );
            section.isEditable = !!(
              this._innovation.status === 'EDITING' ||
              this._innovation.status === 'SUBMITTED'
            );
            break;

          case 'OWNER':
            section.isVisible = !!this._innovation.owner;
            break;

          case 'OPERATOR':
            section.isVisible =
              !!this._isAdmin ||
              !!(this._innovation.operator && this._innovation.operator.id);
            break;

          case 'COMMERCIAL':
            section.isVisible =
              !!this._isAdmin || !!this._clientProject.commercial;
            break;

          case 'RESTITUTION_DATE':
            section.isVisible = !!(
              this._mission.milestoneDates.length > 0 &&
              this._mission.milestoneDates.some(
                (milestone) => milestone.code === 'RDO'
              )
            );
            section.isEditable = !!(
              this._innovation.status === 'EDITING' ||
              this._innovation.status === 'SUBMITTED'
            );
            break;

          case 'ROADMAP':
            section.isVisible = !!(
              this._mission.milestoneDates.length > 0 &&
              this._mission.milestoneDates.some(
                (milestone) => milestone.code !== 'RDO'
              )
            );
            break;

          case 'LANGUAGE':
            section.isVisible = !!(
              this._innovation.innovationCards &&
              this._innovation.innovationCards.length > 0
            );
            break;

          case 'AUTHORISATION':
            section.isVisible = !!this._mission.externalDiffusion;
            break;
        }
      });
    }
  }

  public onClickTab(name: string) {
    this._tabClicked = true;
    this._activeView = name;
  }

  /***
   * when the user clicks the delete button. It opens the delete modal.
   * @param event
   * @param section
   * @param value
   */
  public openDeleteModal(event: Event, section: Section, value: any) {
    event.preventDefault();
    this._selectedValue = value;
    this._activeModalSection = section;
    this._showDeleteModal = true;
  }

  /***
   * when the user clicks the confirm button in the delete modal nad based on the
   * activeModalSection value we call the delete functionality.
   * @param event
   */
  public confirmDeleteModal(event: Event) {
    event.preventDefault();
    this._isDeleting = true;

    switch (this._activeModalSection.name) {
      case 'COLLABORATORS':
        this._deleteCollaborator(this._selectedValue);
        break;

      case 'LANGUAGE':
        this._deleteInnovationCard(this._selectedValue);
        break;
    }
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
      this._selectedValue = '';
      this._activeModalSection = section;
      this._initActiveModalValue();
      this._showModal = true;
    }
  }

  /***
   * based on the section Edit button click we initialize
   * the selectedValue with the default value.
   * @private
   */
  private _initActiveModalValue() {
    switch (this._activeModalSection.name) {
      case 'TITLE':
        this._selectedValue = this._innovation.name;
        break;

      case 'PRINCIPAL_OBJECTIVE':
        this._selectedValue = this._mission.objective.principal;
        break;
    }
  }

  /***
   * when the user clicks on the cancel button in the modal in both.
   */
  public closeModal() {
    this._showModal = false;
    this._showDeleteModal = false;
    this._isDeleting = false;
    this._isSaving = false;
    this._selectedValue = '';
    this._activeModalSection = <Section>{};
    this._collaboratorConsent = false;
  }

  /***
   * when the user clicks the save button in the modal nad based on the activeModalSection level value
   * we call the respected functionality.
   * @param event
   */
  public onClickSaveModal(event: Event) {
    event.preventDefault();
    this._isSaving = true;

    switch (this._activeModalSection.level) {
      case 'INNOVATION':
        this._updateInnovation();
        break;

      case 'MISSION':
        if (this._activeModalSection.name === 'PRINCIPAL_OBJECTIVE') {
          this._updateMainObjective();
        } else {
          this._updateMission({ milestoneDates: this._mission.milestoneDates });
        }
        break;

      case 'COLLABORATOR':
        this._addCollaborator();
        break;
    }
  }

  /***
   * this updates the innovation object, and based on the activeModalSection it assign the value
   * that user wants to update and call the service.
   * @private
   */
  private _updateInnovation() {
    if (this._activeModalSection.name === 'TITLE') {
      this._innovation.name = this._selectedValue;
    }

    this._innovationService
      .save(this._innovation._id, { name: this._innovation.name })
      .pipe(first())
      .subscribe(
        (innovation) => {
          this._innovationFrontService.setInnovation(innovation);
          this.closeModal();
          this._translateNotificationsService.success(
            'ERROR.SUCCESS',
            'ERROR.PROJECT.SAVED_TEXT'
          );
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this._isSaving = false;
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
        }
      );
  }

  /***
   * this updates the mission object, and based on the activeModalSection it assign the value
   * that user wants to update and call the service.
   * @private
   */
  private _updateMission(missionObj: { [P in keyof Mission]?: Mission[P] }) {
    this._missionService
      .save(this._mission._id, missionObj)
      .pipe(first())
      .subscribe(
        (mission) => {
          this._innovation.mission = mission;
          this._innovationFrontService.setInnovation(this._innovation);
          this.closeModal();
          this._translateNotificationsService.success(
            'ERROR.SUCCESS',
            'ERROR.PROJECT.SAVED_TEXT'
          );
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this._isSaving = false;
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
        }
      );
  }

  private _updateMainObjective() {
    this._mission.objective.principal = this._selectedValue;
    if (this._mission.objective.principal['en'] === 'Other') {
      this._mission.objective.secondary = [];
    }

    this._missionService
      .updateMainObjective(this._mission._id, this._mission.objective)
      .pipe(first())
      .subscribe(
        (innovation) => {
          this._innovationFrontService.setInnovation(innovation);
          this.closeModal();
          this._translateNotificationsService.success(
            'ERROR.SUCCESS',
            'ERROR.PROJECT.SAVED_TEXT'
          );
        },
        (err: HttpErrorResponse) => {
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
          console.error(err);
          this._isSaving = false;
        }
      );
  }

  /***
   * when the users want to add the collaborator.
   * @private
   */
  private _addCollaborator() {
    // Un check the consent... We don't want prechecked things
    this._collaboratorConsent = false;
    if (this._selectedValue && emailRegEx.test(this._selectedValue)) {
      this._innovationService
        .inviteCollaborators(this._innovation._id, this._selectedValue)
        .pipe(first())
        .subscribe(
          (collaborator: Collaborator) => {
            console.log(collaborator);
            this._innovation.collaborators = this._innovation.collaborators.concat(
              collaborator.usersAdded
            );
            const collaboratorToList = collaborator.invitationsToSend.concat(
              collaborator.invitationsToSendAgain
            );
            collaboratorToList.map((col) => {
              const newCollaborator = <User>{};
              newCollaborator.email = col;
              this._innovation.collaborators.push(newCollaborator);
            });
            this._innovationFrontService.setInnovation(this._innovation);
            this.closeModal();
            this._translateNotificationsService.success(
              'ERROR.SUCCESS',
              'ERROR.PROJECT.SAVED_TEXT'
            );
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this._isSaving = false;
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
          }
        );
    } else {
      this._translateNotificationsService.error(
        'ERROR.ERROR',
        'COMMON.INVALID.EMAIL'
      );
    }
  }

  /***
   * when the user changes the secondary objectives.
   * @param objectives
   * @param section
   */
  public onChangeSecondaryObjective(objectives: Array<any>, section: Section) {
    if (this.enableSecondaryObjectives(section)) {
      this._mission.objective.secondary = objectives;
      this._updateMission({ objective: this._mission.objective });
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
      this._updateMission({ objective: this._mission.objective });
    }
  }

  /***
   * when the user clicks on the Edit button to change the Restitution date.
   */
  public editRestitutionDate() {
    const index = this._mission.milestoneDates.findIndex(
      (milestone) => milestone.code === 'RDO'
    );
    if (index !== -1) {
      const date = new Date(
        this._mission.milestoneDates[index].dueDate
      ).toISOString();
      this._datePickerOptions = {
        dateRange: false,
        dateFormat: this._currentLang === 'en' ? 'yyyy-mm-dd' : 'dd-mm-yyyy',
        calendarAnimation: { in: CalAnimation.Fade, out: CalAnimation.Fade },
        disableUntil: {
          year: Number(date.slice(0, 4)),
          month: Number(date.slice(5, 7)),
          day: Number(date.slice(8, 10)),
        },
      };
    }
  }

  /***
   * when the user selects the restitution date from the date-picker.
   * @param event
   */
  public onChangeRestitutionDate(event: IMyDateModel) {
    const index = this._mission.milestoneDates.findIndex(
      (milestone) => milestone.code === 'RDO'
    );

    if (event && event.singleDate && event.singleDate.jsDate && index !== -1) {
      this._mission.milestoneDates[index] = {
        name:
          this._currentLang === 'en'
            ? 'Restitution Date'
            : 'Date de restitution',
        code: 'RDO',
        dueDate: event.singleDate.jsDate,
        comment: this._mission.milestoneDates[index].comment,
      };

      this._updateMission({ milestoneDates: this._mission.milestoneDates });
    }
  }

  /***
   * when the user changes the comment of the restitution date.
   * @param Event
   * @param index
   * @param section
   */
  public onChangeMilestoneComment(
    Event: Event,
    index: number,
    section: Section
  ) {
    if (section.isEditable) {
      this._mission.milestoneDates[index].comment =
        (event.target as HTMLInputElement).value || '';
      this._updateMission({ milestoneDates: this._mission.milestoneDates });
    }
  }

  /***
   * this deletes the collaborator.
   * @param collaborator
   * @private
   */
  private _deleteCollaborator(collaborator: User) {
    this._innovationService
      .removeCollaborator(this._innovation._id, collaborator)
      .pipe(first())
      .subscribe(
        (collaborators: Array<User>) => {
          this._innovation.collaborators = collaborators;
          this._innovationFrontService.setInnovation(this._innovation);
          this.closeModal();
          this._translateNotificationsService.success(
            'ERROR.SUCCESS',
            'ERROR.PROJECT.SAVED_TEXT'
          );
        },
        (err: HttpErrorResponse) => {
          console.error(err);
          this._isDeleting = false;
          this._translateNotificationsService.error(
            'ERROR.ERROR',
            ErrorFrontService.getErrorMessage(err.status)
          );
        }
      );
  }

  /***
   * this is to delete the innovationCard.
   * @param card
   * @private
   */
  private _deleteInnovationCard(card: InnovCard) {
    if (this._innovation.innovationCards.length > 1) {
      this._innovationService
        .removeInnovationCard(this._innovation._id, card._id)
        .pipe(first())
        .subscribe(
          () => {
            this._innovation.innovationCards = this._innovation.innovationCards.filter(
              (value) => value._id !== card._id
            );
            this._innovationFrontService.setInnovation(this._innovation);
            this.closeModal();
            this._translateNotificationsService.success(
              'ERROR.SUCCESS',
              'ERROR.PROJECT.SAVED_TEXT'
            );
          },
          (err: HttpErrorResponse) => {
            console.error(err);
            this._isDeleting = false;
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
          }
        );
    }
  }

  /***
   * when the user toggles the authorisation value.
   * @param event
   * @param type
   */
  public onChangeAuthorisation(event: Event, type: string) {
    this._mission.externalDiffusion[
      type
    ] = (event.target as HTMLInputElement).checked;
    this._updateMission({ externalDiffusion: this._mission.externalDiffusion });
  }

  /***
   * if the value of the mission principal objective is 'Other' then
   * we disabled the mission secondary objectives.
   */
  public enableSecondaryObjectives(section: Section): boolean {
    return (
      this._mission.objective.principal['en'] !== 'Other' && section.isEditable
    );
  }

  get canPerformAction(): boolean {
    switch (this._activeModalSection.level) {
      case 'COLLABORATOR':
        return (
          this._collaboratorConsent && !!this._selectedValue && !this._isSaving
        );
      default:
        return !!this._selectedValue && !this._isSaving;
    }
  }

  public isMilestoneReached(date: Date): boolean {
    return date ? new Date(date) <= new Date() : false;
  }

  public isNextMilestoneReached(index: number): boolean {
    if (
      this._mission.milestoneDates[index] &&
      this._mission.milestoneDates[index].dueDate
    ) {
      return (
        new Date(this._mission.milestoneDates[index].dueDate) <= new Date()
      );
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

  get activeModalSection(): Section {
    return this._activeModalSection;
  }

  get selectedValue(): any {
    return this._selectedValue;
  }

  set selectedValue(value: any) {
    this._selectedValue = value;
  }

  get datePickerOptions(): IAngularMyDpOptions {
    return this._datePickerOptions;
  }

  get showDeleteModal(): boolean {
    return this._showDeleteModal;
  }

  set showDeleteModal(value: boolean) {
    this._showDeleteModal = value;
  }

  get isDeleting(): boolean {
    return this._isDeleting;
  }

  get isVisibleMenu(): boolean {
    return this._isVisibleMenu;
  }

  get activeView(): string {
    return this._activeView;
  }

  get consent(): boolean {
    return this._collaboratorConsent;
  }

  set consent(value: boolean) {
    this._collaboratorConsent = value;
  }

  isNotTypeRD0(code: string) {
    return code !== 'RDO' && code.indexOf('RDO') === -1;
  }

  isNotTypeFC0(code: string) {
    return code !== 'FCO' && code.indexOf('FCO') === -1;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
