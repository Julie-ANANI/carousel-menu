import {Component, Input, OnInit} from '@angular/core';
import {MissionQuestion} from '../../../../../models/mission';
import {Answer} from '../../../../../models/answer';
import {Innovation, InnovationFollowUpEmailsTemplate} from '../../../../../models/innovation';
import {RolesFrontService} from '../../../../../services/roles/roles-front.service';
import {first, takeUntil} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../services/error/error-front.service';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../../services/translate-notifications/translate-notifications.service';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';
import {AnswerService} from '../../../../../services/answer/answer.service';
import {Professional} from '../../../../../models/professional';
import {FilterService} from '../../shared-market-report/services/filters.service';
import {Subject} from 'rxjs';
import {Table, UmiusConfigInterface, UmiusSidebarInterface} from '@umius/umi-common-component';

interface Pending {
  answersIds?: Array<string>;
  objective?: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW';
  assignedAnswers?: Array<{ name: string, objective: string }>;
}

interface Custom {
  fr: Array<{ label: string, value: string }>;
  en: Array<{ label: string, value: string }>;
}

@Component({
  selector: 'app-shared-follow-up-admin',
  templateUrl: './shared-follow-up-admin.component.html',
  styleUrls: ['./shared-follow-up-admin.component.scss']
})
export class SharedFollowUpAdminComponent implements OnInit {

  get emailTemplate(): InnovationFollowUpEmailsTemplate {
    return this._emailTemplate;
  }

  set emailTemplate(value: InnovationFollowUpEmailsTemplate) {
    this._emailTemplate = value;
  }

  // ex: ['projects', 'project', 'followUp']
  @Input() accessPath: Array<string> = [];

  @Input() questions: Array<MissionQuestion> = [];

  @Input() set answers (value: Array<Answer>) {
    this._answers = value;
    this._initFilter();
    this._initTable(value, value.length);
  }

  @Input() set project(value: Innovation) {
    this._project = value;
  }

  private _answers: Array<Answer> = [];

  private _project: Innovation = <Innovation>{};

  private _modalAnswer: Answer = <Answer>{};

  private _pendingAction: Pending = <Pending>{};

  private _customFields: Custom = {
    en: [],
    fr: []
  };

  private _sidebarTemplate: UmiusSidebarInterface = {
    animate_state: 'inactive',
    type: 'FOLLOW_UP'
  };

  private _sidebarAnswer: UmiusSidebarInterface = <UmiusSidebarInterface>{};

  private _modalTemplateType = '';

  private _loadingButton = false;

  private _showEmailsModal = false;

  private _showWarningModal = false;

  private _showSendModal = false;

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": "-1" }'
  };

  private _tableInfos: Table = <Table>{};

  private _subscribe: Subject<any> = new Subject<any>();

  private _emailTemplate: InnovationFollowUpEmailsTemplate = <InnovationFollowUpEmailsTemplate>{};

  private static _isRowDisabled(answer: Answer): boolean {
    return !!(answer.followUp && answer.followUp.date);
  }

  constructor(private _rolesFrontService: RolesFrontService,
              private _innovationService: InnovationService,
              private _answerService: AnswerService,
              private _filterService: FilterService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
  }

  private _initFilter() {
    if (this._answers.length) {
      this._filterService.filtersUpdate.pipe(takeUntil(this._subscribe)).subscribe(() => {
        const _filtered = this._filterService.filter(this._answers)
          .filter((_answer) => !SharedFollowUpAdminComponent._isRowDisabled(_answer));
        this._initTable(_filtered, _filtered.length);
      });
    }
  }

  private _initTable(answers: Array<Answer> = [], total = 0) {
    this._tableInfos = {
      _selector: 'follow-up-answers',
      _content: answers,
      _total: total,
      _isSelectable: this.canAccess(['edit', 'objective']),
      _isRowDisabled: (answer: Answer) => SharedFollowUpAdminComponent._isRowDisabled(answer),
      _clickIndex: this.canAccess(['view', 'answer']) || this.canAccess(['edit', 'answer']) ? 1 : null,
      _isPaginable: true,
      _paginationTemplate: 'TEMPLATE_1',
      _isLocal: true,
      _isNoMinHeight: answers.length < 11,
      _actions: [
        {_label: 'SHARED_FOLLOW_UP.BUTTON.INTERVIEW'},
        {_label: 'SHARED_FOLLOW_UP.BUTTON.OPENING'},
        {_label: 'SHARED_FOLLOW_UP.BUTTON.NO_FOLLOW'},
        {_label: 'SHARED_FOLLOW_UP.BUTTON.WITHOUT_OBJECTIVE'},
      ],
      _columns: [
        {
          _attrs: ['professional.firstName', 'professional.lastName'],
          _name: 'COMMON.LABEL.NAME',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'name'])
        },
        {
          _attrs: ['country'],
          _name: 'COMMON.LABEL.COUNTRY',
          _type: 'COUNTRY',
          _width: '100px',
          _isHidden: !this.canAccess(['tableColumns', 'country'])
        },
        {
          _attrs: ['professional.language'],
          _name: 'COMMON.LABEL.LANGUAGE',
          _type: 'TEXT',
          _width: '110px',
          _isHidden: !this.canAccess(['tableColumns', 'language'])
        },
        {
          _attrs: ['professional.jobTitle'],
          _name: 'COMMON.LABEL.JOBTITLE',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'job'])
        },
        {
          _attrs: ['professional.company.name'],
          _name: 'COMMON.LABEL.COMPANY',
          _type: 'TEXT',
          _isHidden: !this.canAccess(['tableColumns', 'company'])
        },
        {
          _attrs: ['followUp.objective'],
          _name: 'TABLE.HEADING.OBJECTIVE',
          _type: 'DROPDOWN',
          _width: '200px',
          _isHidden: !this.canAccess(['tableColumns', 'objective']),
          _choices: [
            {
              _name: 'INTERVIEW',
              _alias: 'SHARED_FOLLOW_UP.BUTTON.INTERVIEW',
              _class: 'button is-secondary',
              _disabledClass: 'text-secondary'
            },
            {
              _name: 'OPENING',
              _alias: 'SHARED_FOLLOW_UP.BUTTON.OPENING',
              _class: 'button is-draft',
              _disabledClass: 'text-draft'
            },
            {
              _name: 'NO_FOLLOW',
              _alias: 'SHARED_FOLLOW_UP.BUTTON.NO_FOLLOW',
              _class: 'button is-danger',
              _disabledClass: 'text-alert'
            },
            {
              _name: 'WITHOUT_OBJECTIVE',
              _alias: 'SHARED_FOLLOW_UP.BUTTON.WITHOUT_OBJECTIVE',
              _class: ''
            }
          ],
          _disabledState: {_attrs: 'followUp.date', _type: 'DATE'}
        },
      ]
    };
  }

  private _reinitializeVariables() {
    this._showEmailsModal = false;
    this._showWarningModal = false;
    this._showSendModal = false;
    this._modalTemplateType = '';
  }

  public openModal(event: Event) {
    event.preventDefault();
    this._showSendModal = true;
  }

  public closeModal(event: Event) {
    event.preventDefault();
    this._reinitializeVariables();
  }

  public onClickSee(event: Event, type: string) {
    event.preventDefault();
    this._initializeMailCustomFields();
    this._reinitializeVariables();
    this._modalTemplateType = type;
    this._emailTemplate = InnovationFrontService.getFollowUpTemplate(this._project?.followUpEmails?.templates, type.toUpperCase());
    this._showEmailsModal = true;
  }

  public onClickConfirm(event: Event) {
    event.preventDefault();
    this._loadingButton = true;
    /*
    TODO: this function is to notify Kate when we put this tab on the client side
    this._innovationService.finishLinking(this.project._id).subscribe((value) => {
      this._translateNotificationsService.success('ERROR.PROJECT.LINKING', 'ERROR.PROJECT.LINKING_DONE');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
    */

    this._innovationService.sendFollowUpEmails(this._project._id).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SEND_EMAILS_OK');
      this._loadingButton = false;
    }, (err: HttpErrorResponse) => {
      this._loadingButton = false;
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });

  }

  public sendTestEmails() {
    const objective = this._modalTemplateType;
    this._innovationService.sendFollowUpEmails(this._project._id, objective).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SEND_EMAILS_OK');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public saveProject() {
    const _obj = {followUpEmails: this._project.followUpEmails};

    this._innovationService.save(this._project._id, _obj).pipe(first()).subscribe((response: Innovation) => {
      this._project = response;
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  private _initializeMailCustomFields() {
    this._customFields = {
      fr: [
        {value: '*|FIRSTNAME|*', label: 'Prénom du pro'},
        {value: '*|LASTNAME|*', label: 'Nom du pro'},
        {
          value: '*|TITLE|*',
          label: InnovationFrontService.currentLangInnovationCard(this._project, 'fr', 'TITLE')
            || 'TITLE'
        },
        {
          value: '*|COMPANY_NAME|*',
          label: this._project.owner && this._project.owner.company ? this._project.owner.company.name : 'COMPANY_NAME'
        },
        {value: '*|CLIENT_NAME|*', label: this._project.owner ? this._project.owner.name : 'CLIENT_NAME'}
      ],
      en: [
        {value: '*|FIRSTNAME|*', label: 'First name'},
        {value: '*|LASTNAME|*', label: 'Last name'},
        {
          value: '*|TITLE|*',
          label: InnovationFrontService.currentLangInnovationCard(this._project, 'en', 'TITLE')
            || 'TITLE'
        },
        {
          value: '*|COMPANY_NAME|*',
          label: this._project.owner && this._project.owner.company ? this._project.owner.company.name : 'COMPANY_NAME'
        },
        {value: '*|CLIENT_NAME|*', label: this._project.owner ? this._project.owner.name : 'CLIENT_NAME'}
      ]
    };
  }

  public assignObjective(event: any) {
    const answerId = event.content._id;
    const objective = event.item._name;

    this._answerService.updateLinkingStatus([answerId], objective).pipe(first()).subscribe(() => {
      const answerToUpdate = this._answers.findIndex(answer => answer._id === answerId);
      this._answers[answerToUpdate].followUp.objective = objective;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });

  }

  private _prosByObjective(objective: string, sent: boolean): Array<Answer> {
    objective = objective === 'NOFOLLOW' ? 'NO_FOLLOW' : objective;
    return this._answers.filter(answer => !!answer.followUp.date === sent && answer.followUp.objective === objective);
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath);
    }
  }

  public updateAnswers(answers: Array<Answer>) {
    answers.forEach((_answer) => {
      if (!SharedFollowUpAdminComponent._isRowDisabled(_answer)) {
        _answer._isSelected = true;
      }
    });
  }

  public seeAnswer(answer: Answer) {
    this._modalAnswer = answer;
    this._sidebarAnswer = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EDIT_INSIGHT',
      size: '726px'
    };
  }

  public performActions(action: any) {
    const objective = action._action === 'WITHOUT_OBJECTIVE' ? '' : action._action.split('.').slice(-1)[0];
    const answersIds = action._rows.map((answer: any) => answer._id);

    // First we check if some selected users already have an objective
    const assignedAnswers = action._rows
      .filter((answer: any) => answer.followUp.objective && answer.followUp.objective !== objective)
      .map((answer: any) => {
        return {
          name: `${answer.professional.firstName} ${answer.professional.lastName}`,
          objective: answer.followUp.objective
        };
      });

    if (assignedAnswers.length) {
      // If so, we open the confirmation modal
      this._showWarningModal = true;
      this._pendingAction = {
        answersIds: answersIds,
        objective: objective,
        assignedAnswers: assignedAnswers
      };
    } else {
      // Otherwise, we save the objectives
      this.updateManyObjectives(answersIds, objective);
    }

  }

  public closeSidebar() {
    this._sidebarTemplate = {
      animate_state: 'inactive'
    };
  }

  public updateManyObjectives(answersIds: Array<string>, objective: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW') {
    this._pendingAction = {};
    this._showWarningModal = false;
    this._answerService.updateLinkingStatus(answersIds, objective).pipe(first()).subscribe(() => {
      answersIds.forEach((answerId: string) => {
        const answerToUpdate = this._answers.findIndex(answer => answer._id === answerId);
        this._answers[answerToUpdate].followUp.objective = objective;
      });
    });
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

  set config(value: UmiusConfigInterface) {
    this._config = value;
  }

  get customFields(): { fr: Array<{ label: string, value: string }>, en: Array<{ label: string, value: string }> } {
    return this._customFields;
  }

  get sidebarTemplate(): UmiusSidebarInterface {
    return this._sidebarTemplate;
  }

  set sidebarTemplate(value: UmiusSidebarInterface) {
    this._sidebarTemplate = value;
  }

  get modalTemplateType(): string {
    return this._modalTemplateType;
  }

  get showEmailsModal(): boolean {
    return this._showEmailsModal;
  }

  set showEmailsModal(value: boolean) {
    this._showEmailsModal = value;
  }

  get showSendModal(): boolean {
    return this._showSendModal;
  }

  set showSendModal(value: boolean) {
    this._showSendModal = value;
  }

  get showWarningModal(): boolean {
    return this._showWarningModal;
  }

  get loadingButton(): boolean {
    return this._loadingButton;
  }

  set showWarningModal(value: boolean) {
    this._showWarningModal = value;
  }

  get pros(): Array<Professional> {
    if (this._modalTemplateType) {
      return this._prosByObjective(this._modalTemplateType.toUpperCase(), false).map(answer => answer.professional);
    }
    return [];
  }

  get prosWithoutObjective(): Array<Answer> {
    return this._answers.filter(answer => !answer.followUp.objective);
  }

  get prosInterview(): Array<Answer> {
    return this._prosByObjective('INTERVIEW', false);
  }

  get prosInterviewSent(): Array<Answer> {
    return this._prosByObjective('INTERVIEW', true);
  }

  get prosOpening(): Array<Answer> {
    return this._prosByObjective('OPENING', false);
  }

  get prosOpeningSent(): Array<Answer> {
    return this._prosByObjective('OPENING', true);
  }

  get prosNoFollow(): Array<Answer> {
    return this._prosByObjective('NO_FOLLOW', false);
  }

  get prosNoFollowSent(): Array<Answer> {
    return this._prosByObjective('NO_FOLLOW', true);
  }

  get pendingAction(): {
    answersIds?: Array<string>, objective?: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW',
    assignedAnswers?: Array<{ name: string, objective: string }>
  } {
    return this._pendingAction;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get sidebarAnswer(): UmiusSidebarInterface {
    return this._sidebarAnswer;
  }

  set sidebarAnswer(value: UmiusSidebarInterface) {
    this._sidebarAnswer = value;
  }

  get ccEmail(): string {
    return this._project.followUpEmails.ccEmail;
  }

  set ccEmail(value: string) {
    this._project.followUpEmails.ccEmail = value;
  }

  // TODO delete the commented part after multilang migration
  /*set emailsObject(value: any) {
    this._project.followUpEmails[this._modalTemplateType] = value;
  }

  get emailsObject(): any {
    return this._project.followUpEmails[this._modalTemplateType] || {
      en: {content: '', subject: ''},
      fr: {content: '', subject: ''}
    };
  }*/

  get project(): Innovation {
    return this._project;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

}
