import {Component, HostListener, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {InnovationFrontService} from '../../../../../../../services/innovation/innovation-front.service';
import {Innovation} from '../../../../../../../models/innovation';
import {Milestone, Mission, MissionQuestion, MissionTemplate} from '../../../../../../../models/mission';
import {first, takeUntil} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {AuthService} from '../../../../../../../services/auth/auth.service';
import {TranslateService} from '@ngx-translate/core';
import {ClientProject} from '../../../../../../../models/client-project';
import {InnovationService} from '../../../../../../../services/innovation/innovation.service';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../../../services/translate-notifications/translate-notifications.service';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {MissionService} from '../../../../../../../services/mission/mission.service';
import {IMyDateModel} from 'angular-mydatepicker';
import {emailRegEx} from '../../../../../../../utils/regex';
import {Collaborator} from '../../../../../../../models/collaborator';
import {User} from '../../../../../../../models/user.model';
import {InnovCard} from '../../../../../../../models/innov-card';
import {MissionFrontService} from '../../../../../../../services/mission/mission-front.service';
import {isPlatformBrowser} from '@angular/common';
import {UserFrontService} from '../../../../../../../services/user/user-front.service';
import * as moment from 'moment';
import {CommonService} from '../../../../../../../services/common/common.service';

interface Section {
  name: string;
  isVisible: boolean;
  isEditable: boolean;
  level: 'CLIENT_PROJECT' | 'MISSION' | 'INNOVATION' | 'COLLABORATOR' | 'ALL';
  field?: string;
}

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _mission: Mission = <Mission>{};

  private _clientProject: ClientProject = <ClientProject>{};

  private _isAdmin = false;

  private _activeView = 'TITLE';

  private _sections: Array<Section> = [];

  private _showModal = false;

  private _activeModalSection: Section = <Section>{};

  private _selectedValue: any = '';

  private _isSaving = false;

  private _showDeleteModal = false;

  private _isDeleting = false;

  private _isVisibleMenu = true;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _tabClicked = false;

  private _missionTemplates: Array<MissionTemplate> = [];

  private _isFetchingTemplates = false;

  /**
   * store the actual store template that we get by filtering from missionTemplates.
   */
  private _definedTemplate: MissionTemplate = <MissionTemplate>{};

  private _disabledDate = '';

  /**
   * when the user try to change the objective we ask him to tick the box to confirm.
   */
  private _objectiveConsent = true;

  private _pendingCollaborators: Array<string> = [];

  private _getCollaborators = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _authService: AuthService,
              private _commonService: CommonService,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _missionService: MissionService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationFrontService: InnovationFrontService) {
  }

  ngOnInit() {
    this._initValues();

    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation || <Innovation>{};

      if (<Mission>this._innovation.mission && (<Mission>this._innovation.mission)._id) {
        this._mission = <Mission>this._innovation.mission;
        if (this._mission.milestoneDates.length > 1) {
          this._mission.milestoneDates = MissionFrontService.sortMilestoneDates(this._mission.milestoneDates);
        }
      }

      if (<ClientProject>this._innovation.clientProject && (<ClientProject>this._innovation.clientProject)._id) {
        this._clientProject = <ClientProject>this._innovation.clientProject;
      }

      this._getPendingCollaborators();
      this._initSections();
    });
  }

  /**
   * initialize with the default values.
   * @private
   */
  private _initValues() {
    this._isAdmin = this._authService.isAdmin;
    this._disabledDate = moment().add(-1, 'days').format('YYYY-MM-DD');
    this._mission = {
      objective: {
        principal: {en: '', fr: ''},
        secondary: [],
        comment: ''
      },
      milestoneDates: []
    };

    this._sections = [
      {name: 'TITLE', isVisible: false, isEditable: true, level: 'INNOVATION'},
      {name: 'PRINCIPAL_OBJECTIVE', isVisible: false, isEditable: false, level: 'MISSION'},
      {name: 'SECONDARY_OBJECTIVE', isVisible: false, isEditable: false, level: 'MISSION'},
      {name: 'ROADMAP', isVisible: false, isEditable: false, level: 'MISSION'},
      {name: 'RESTITUTION_DATE', isVisible: false, isEditable: false, level: 'MISSION'},
      {name: 'REPORTING_LANG', isVisible: false, isEditable: false, level: 'INNOVATION'},
      {name: 'OWNER', isVisible: false, isEditable: false, level: 'ALL'},
      {name: 'COLLABORATORS', isVisible: true, isEditable: true, level: 'COLLABORATOR'},
      {name: 'OPERATOR', isVisible: false, isEditable: false, level: 'INNOVATION'},
      {name: 'COMMERCIAL', isVisible: false, isEditable: false, level: 'CLIENT_PROJECT'},
      {name: 'LANGUAGE', isVisible: false, isEditable: false, level: 'INNOVATION'},
      {name: 'AUTHORISATION', isVisible: false, isEditable: true, level: 'MISSION'},
    ];
  }

  private _getPendingCollaborators() {
    if (this._innovation._id && isPlatformBrowser(this._platformId) && this._getCollaborators) {
      this._getCollaborators = false;
      this._innovationService.getPendingCollaborators(this._innovation._id)
        .pipe(first())
        .subscribe((response) => {
          if (response && response.result && response.result.length) {
            this._pendingCollaborators = response.result.map((_res) => _res.invitee_email);
          }
          }, (err: HttpErrorResponse) => {
          this._getCollaborators = true;
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }
  }

  /**
   * getting the mission use cases templates from the back.
   * @private
   */
  private _getAllMissionTemplates() {
    if (isPlatformBrowser(this._platformId) && this.hasMissionTemplate && this.isEditable && this._missionTemplates.length === 0) {
      this._isFetchingTemplates = true;
      this._missionService.getAllTemplates().pipe(first()).subscribe((response) => {
        this._missionTemplates = response && response.result || [];
        this._initDefinedTemplate();
        this._isFetchingTemplates = false;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._isFetchingTemplates = false;
        console.error(err);
      });
    }
  }

  /**
   * return the original template from the missionTemplates based on the template
   * associated in the mission object.
   * we need it when we perform the selection/de-selection of the secondary objectives.
   * @private
   */
  private _initDefinedTemplate() {
    const template = this._missionTemplates.filter((_template) => {
      return _template._id === (this._mission.template && this._mission.template._id);
    });
    this._definedTemplate = template.length ? template[0] : <MissionTemplate>{};
  }

  /**
   * name of the Commercial | Operator | Owner
   * @param user
   */
  public fullName(user: User): string {
    return UserFrontService.fullName(user);
  }

  /**
   * make edit button visible and invisible for the section.
   * @param value - based on it shows the edit button for the section.
   */
  public editButton(value: string): boolean {
    return (this.isEditable && (value === 'TITLE' || value === 'REPORTING_LANG' || value === 'RESTITUTION_DATE'
      || value === 'SECONDARY_OBJECTIVE' || value === 'PRINCIPAL_OBJECTIVE')) || value === 'COLLABORATORS';
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if (!this._tabClicked) {
      const _pageOffset = window.pageYOffset;
      if (_pageOffset > 0) {
        this._sections.forEach((section) => {
          const _element = document.getElementById(section.name.toLowerCase());
          if (_element) {
            const _elementOffset = _element.offsetTop;
            if ((_elementOffset - _pageOffset) > -1 && (_elementOffset - _pageOffset) < 50) {
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
            section.isVisible = this.hasMissionTemplate || this.isOldObjective;
            section.isEditable = this.isEditable;
            break;

          case 'SECONDARY_OBJECTIVE':
            section.isVisible = !!this._mission.objectiveComment || !!(this._mission.objective.comment)
              || !!(this._mission.objective.secondary && this._mission.objective.secondary.length)
              || this.templateComplementary.length > 0
              || ((this.hasMissionTemplate || this.isOldObjective) && this.isEditable);
            section.isEditable = this.isEditable;
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
            section.isVisible = this._mission.milestoneDates.length && !!this.dateRDO;
            section.isEditable = this.isEditable;
            break;

          case 'ROADMAP':
            section.isVisible = !!(this._mission.milestoneDates.length > 0
              && this._mission.milestoneDates.some((milestone) => milestone.code !== 'RDO'));
            break;

          case 'REPORTING_LANG':
            section.isVisible = !!(this._innovation.settings && this._innovation.settings.reportingLang);
            section.isEditable = this.isEditable;
            break;

          case 'LANGUAGE':
            section.isVisible = !!(this._innovation.innovationCards && this._innovation.innovationCards.length > 0);
            break;

          case 'AUTHORISATION':
            section.isVisible = !!(this._mission.externalDiffusion);
            break;

        }
      });
    }
  }

  /**
   * when change the result lang from the modal.
   * @param event
   * @param value
   */
  public onChangeReportingLang(event: Event, value: string) {
    event.preventDefault();
    this._selectedValue = value;
  }

  /**
   * when change the collaborator consent in the modal.
   * @param event
   */
  public onChangeCollaboratorsConsent(event: Event) {
    const value = (event.target as HTMLInputElement).checked;
    if (!!value) {
      this._selectedValue.consent = true;
      this._updateInnovation({collaboratorsConsent: {value: value, date: new Date()}}, false);
    } else {
      this._selectedValue.consent = false;
    }
  }

  public onClickTab(name: string) {
    this._tabClicked = true;
    this._activeView = name;
  }

  /**
   * @param value
   */
  public objectiveName(value: any): string {
    return MissionFrontService.objectiveName(value, this.currentLang);
  }

  /***
   * when the user clicks the delete button. It opens the delete modal.
   * @param event
   * @param section
   * @param value
   * @param type
   */
  public openDeleteModal(event: Event, section: Section, value: any, type: any = null) {
    event.preventDefault();
    this._selectedValue = !!type ? {value, type} : value;
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
        if (this._selectedValue.type === 'PENDING_COLLABORATOR') {
          this._removePendingCollaborator();
        } else {
          this._deleteCollaborator(this._selectedValue);
        }
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
      this._objectiveConsent = true;
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

      case 'RESTITUTION_DATE':
        this._selectedValue = {
          comment: !!this.dateRDO && this.dateRDO.comment,
          date: !!this.dateRDO && this.dateRDO.dueDate
        };
        this._setDatePicker();
        break;

      case 'REPORTING_LANG':
        this._selectedValue = this._innovation.settings.reportingLang;
        break;

      case 'PRINCIPAL_OBJECTIVE':
        if (this.hasMissionTemplate) {
          this._objectiveConsent = false;
          this._getAllMissionTemplates();
          this._selectedValue = null;
        } else {
          this._selectedValue = this._mission.objective.principal;
        }
        break;

      case 'SECONDARY_OBJECTIVE':
        if (this.hasMissionTemplate) {
          this._objectiveConsent = false;
          this._getAllMissionTemplates();
          this._selectedValue = {
            sections: JSON.parse(JSON.stringify(this._mission.template.sections)),
            comment: this._mission.objectiveComment
          };
        } else {
          this._selectedValue = {
            objectives: JSON.parse(JSON.stringify(this._mission.objective.secondary)),
            comment: this._mission.objective.comment
          };
        }
        break;

      case 'COLLABORATORS':
        this._selectedValue = {
          consent: false,
          email: ''
        };
        break;

    }
  }

  /**
   * we are setting the date picker default month value and
   * marking the selected date.
   * @private
   */
  private _setDatePicker() {
    if (!!this._selectedValue && this._selectedValue.date) {
      const date = moment(this._selectedValue.date);
      this._selectedValue.datePickerMonth = {
        month: date.month() + 1,
        year: date.year()
      };
      this._selectedValue.markDates = [
        {
          dates: [{day: date.date(), month: date.month() + 1, year: date.year()}],
          color: '#2ECC71'
        }
      ];
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
    this._isFetchingTemplates = false;
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
        switch (this._activeModalSection.name) {

          case 'TITLE':
            this._updateInnovation({name: this._selectedValue});
            break;

          case 'REPORTING_LANG':
            const settings = JSON.parse(JSON.stringify(this._innovation.settings));
            settings.reportingLang = this._selectedValue;
            this._updateInnovation({settings: settings});
            break;
        }
        break;

      case 'MISSION':
        switch (this._activeModalSection.name) {

          case 'RESTITUTION_DATE':
            const milestones = JSON.parse(JSON.stringify(this._mission.milestoneDates));
            milestones[this.dateRDOIndex].dueDate = this._selectedValue.date;
            milestones[this.dateRDOIndex].comment = this._selectedValue.comment;
            this._updateMission({milestoneDates: milestones});
            break;

          case 'PRINCIPAL_OBJECTIVE':
            if (this.hasMissionTemplate) {
              this._updateTemplate({template: this._selectedValue, comment: this._mission.objectiveComment});
            } else if (this.isOldObjective) {
              const objective = JSON.parse(JSON.stringify(this._mission.objective));
              objective.principal = this._selectedValue;
              if (objective.principal['en'] === 'Other') {
                objective.secondary = [];
              }
              this._updateMainObjective(objective);
            }
            break;

          case 'SECONDARY_OBJECTIVE':
            if (this.hasMissionTemplate) {
              const template = JSON.parse(JSON.stringify(this._mission.template));
              template.sections = this._selectedValue.sections;
              this._verifyFollowUpStatus(template);
              this._updateMission({objectiveComment: this._selectedValue.comment, template: template});
            } else if (this.isOldObjective) {
              const objective = JSON.parse(JSON.stringify(this._mission.objective));
              objective.secondary = this._selectedValue.objectives;
              objective.comment = this._selectedValue.comment;
              this._updateMission({objective: objective});
            }
        }
        break;

      case 'COLLABORATOR':
        this._addCollaborator();
        break;

    }

  }

  /**
   * here check follow up status to show or hide the follow up module.
   * @param template
   * @private
   */
  private _verifyFollowUpStatus(template: MissionTemplate) {
    if (this._innovation.followUpEmails && this._innovation.followUpEmails.status) {
      const newStatus = InnovationFrontService.getFollowUpStatus(template);
      const followUpEmails = this._innovation.followUpEmails;
      const oldStatus = followUpEmails.status;

      if (oldStatus !== newStatus) {
        followUpEmails.status = newStatus;
        this._innovation.followUpEmails = followUpEmails;
        this._updateInnovation({followUpEmails: followUpEmails});
      }
    }
  }

  /**
   * this update the mission template and the object comment if there.
   * @param data
   * @private
   */
  private _updateTemplate(data: any) {
    this._missionService.updateTemplate(this._mission._id, data).pipe(first()).subscribe((innovation) => {
      this._innovation.mission = innovation.mission;
      this._innovationFrontService.setInnovation(this._innovation);
      this.closeModal();
      this._initDefinedTemplate();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      this._isSaving = false;
      console.error(err);
    });
  }

  /***
   * this updates the innovation object, and based on the activeModalSection it assign the value
   * that user wants to update and call the service.
   * @private
   */
  private _updateInnovation(innovObject: { [P in keyof Innovation]?: Innovation[P]; }, closeModal = true) {
    this._innovationService.save(this._innovation._id, innovObject).pipe(first()).subscribe((_) => {
      if (closeModal) {
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      this._isSaving = false;
      console.error(err);
    });
  }

  /***
   * this updates the mission object, and based on the activeModalSection it assign the value
   * that user wants to update and call the service.
   * @private
   */
  private _updateMission(missionObj: { [P in keyof Mission]?: Mission[P]; }) {
    this._missionService.save(this._mission._id, missionObj).pipe(first()).subscribe((mission) => {
      this._innovation.mission = mission;
      this._innovationFrontService.setInnovation(this._innovation);
      this.closeModal();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      this._isSaving = false;
      console.error(err);
    });
  }

  private _updateMainObjective(objective: any) {
    this._missionService.updateMainObjective(this._mission._id, objective).pipe(first()).subscribe((innovation) => {
      this._innovation.mission = innovation.mission;
      this._innovationFrontService.setInnovation(this._innovation);
      this.closeModal();
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      this._isSaving = false;
      console.error(err);
    });
  }

  /***
   * when the users want to add the collaborator.
   * Now we are storing the consent value in the innovation model.
   * on 4th June, 2021
   * @private
   */
  private _addCollaborator() {
    if (this._selectedValue.email && emailRegEx.test(this._selectedValue.email)) {
      this._innovationService.inviteCollaborators(this._innovation._id, this._selectedValue.email)
        .pipe(first()).subscribe((collaborator: Collaborator = <Collaborator>{}) => {

          if (collaborator.usersAdded.length) {
            this._innovation.collaborators = this._innovation.collaborators.concat(collaborator.usersAdded);
            this._innovationFrontService.setInnovation(this._innovation);
            this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.COLLABORATORS_ADDED');
          }

          if (collaborator.invitationsToSendAgain.length || collaborator.invitationsToSend.length) {
            collaborator.invitationsToSend.concat(collaborator.invitationsToSendAgain).map((_invite) => {
              const find = this._pendingCollaborators.some((_collaborator) => _collaborator === _invite);
              if (!find) {
                this._pendingCollaborators.push(_invite);
              }
            });
            this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SEND_EMAILS_OK');
          }

          this.closeModal();
          }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          this._isSaving = false;
          console.error(err);
        });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'COMMON.INVALID.EMAIL');
    }
  }



  /***
   * when the user changes the secondary objectives.
   * @param event
   */
  public onChangeObjectives(event: Array<any>) {
    if (this._activeModalSection.isEditable) {
      if (this.hasMissionTemplate) {
        this._selectedValue.sections = event;
      } else if (this.isOldObjective) {
        this._selectedValue.objectives = event;
      }
    }
  }

  /***
   * when the user changes the comment in the modal of restitution date.
   * updated on 3rd June, 2021
   * @param event
   */
  public onChangeComment(event: string) {
    if (this._activeModalSection.isEditable) {
      this._selectedValue.comment = event;
    }
  }

  /***
   * when the user selects the restitution date from the date-picker in the modal.
   * updated on 3rd June, 2021
   * @param event
   */
  public onChangeRestitutionDate(event: IMyDateModel) {
    if (event && event.singleDate && event.singleDate.jsDate) {
      this._selectedValue.date = event.singleDate.jsDate;
      this._setDatePicker();
    }
  }

  public onChangeTemplate(event: MissionTemplate) {
    if (this._activeModalSection.isEditable) {
      this._selectedValue = event;
    }
  }

  private _removePendingCollaborator() {
    this._innovationService.removePendingCollaborator(this._selectedValue.value, this._innovation._id)
      .pipe(first())
      .subscribe(() => {
        this._pendingCollaborators = this._pendingCollaborators.filter((_collaborator) => {
          return _collaborator !== this._selectedValue.value;
        });
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.COLLABORATOR_DELETED');
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._isDeleting = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
  }

  /***
   * this deletes the collaborator.
   * @param collaborator
   * @private
   */
  private _deleteCollaborator(collaborator: User) {
    this._innovationService.removeCollaborator(this._innovation._id, collaborator)
      .pipe(first())
      .subscribe((collaborators: Array<User>) => {
        this._innovation.collaborators = collaborators;
        this._innovationFrontService.setInnovation(this._innovation);
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.COLLABORATOR_DELETED');
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._isDeleting = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
  }

  /***
   * this is to delete the innovationCard.
   * @param card
   * @private
   */
  private _deleteInnovationCard(card: InnovCard) {
    if (this._innovation.innovationCards.length > 1) {
      this._innovationService.removeInnovationCard(this._innovation._id, card._id).pipe(first()).subscribe(() => {
        this._innovation.innovationCards = this._innovation.innovationCards.filter((value) => value._id !== card._id);
        this._innovationFrontService.setInnovation(this._innovation);
        this.closeModal();
        this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._isDeleting = false;
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      });
    }
  }

  /***
   * when the user toggles the authorisation value.
   * @param event
   * @param type
   */
  public onChangeAuthorisation(event: Event, type: string) {
    this._mission.externalDiffusion[type] = ((event.target) as HTMLInputElement).checked;
    this._updateMission({externalDiffusion: this._mission.externalDiffusion});
  }

  /***
   * if the value of the mission principal objective is 'Other' then
   * we disabled the mission secondary objectives.
   */
  get enableSecondaryObjectives(): boolean {
    return this._mission.objective.principal['en'] !== 'Other' && this._activeModalSection.isEditable;
  }

  get isDisabled(): boolean {
    if (this._activeModalSection.level === 'COLLABORATOR') {
      return !this._selectedValue.consent || !this._selectedValue.email || this._isSaving;
    } else if (this.hasMissionTemplate && this._activeModalSection.level === 'MISSION') {
      return this._isFetchingTemplates || !this._selectedValue;
    } else {
      return !this._selectedValue || this._isSaving;
    }
  }

  public isMilestoneReached(date: Date): boolean {
    return date ? new Date(date) <= new Date() : false;
  }

  public isNextMilestoneReached(index: number): boolean {
    if (this._mission.milestoneDates[index] && this._mission.milestoneDates[index].dueDate) {
      return new Date(this._mission.milestoneDates[index].dueDate) <= new Date();
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
    return this._translateService.currentLang;
  }

  get dateFormat(): string {
    return this._commonService.dateFormat();
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

  get pendingCollaborators(): Array<string> {
    return this._pendingCollaborators;
  }

  get objectiveConsent(): boolean {
    return this._objectiveConsent;
  }

  set objectiveConsent(value: boolean) {
    this._objectiveConsent = value;
  }

  get disabledDate(): string {
    return this._disabledDate;
  }

  get isEditable(): boolean {
    return !!this._innovation.status && (this._innovation.status === 'EDITING' || this._innovation.status === 'SUBMITTED');
  }

  get templateComplementary(): Array<MissionQuestion> {
    return this.hasMissionTemplate
      && MissionFrontService.combineComplementaryObjectives(this._mission.template.sections)
        .filter((_objective) => !!this.objectiveName(_objective)) || [];
  }

  get definedTemplate(): MissionTemplate {
    return this._definedTemplate;
  }

  get missionTemplates(): Array<MissionTemplate> {
    return this._missionTemplates;
  }

  get isFetchingTemplates(): boolean {
    return this._isFetchingTemplates;
  }

  get hasMissionTemplate(): boolean {
    return !!(this._mission.template && this._mission.template.entry && this._mission.template.entry.length);
  }

  get isOldObjective(): boolean {
    return !!(this._mission.objective.principal && this._mission.objective.principal[this.currentLang]);
  }

  get dateRDOIndex(): number {
    return this._mission.milestoneDates.findIndex((value) => value.code === 'RDO');
  }

  get dateRDO(): Milestone {
    return this._mission.milestoneDates.find((value) => value.code === 'RDO');
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
