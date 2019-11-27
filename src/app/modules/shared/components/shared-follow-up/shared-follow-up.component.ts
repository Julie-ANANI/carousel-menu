import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateNotificationsService } from "../../../../services/notifications/notifications.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { Innovation } from "../../../../models/innovation";
import { InnovationFrontService } from "../../../../services/innovation/innovation-front.service";
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';
import { AnswerService } from "../../../../services/answer/answer.service";
import { Answer } from "../../../../models/answer";
import { Table } from "../../../table/models/table";
import { Professional } from "../../../../models/professional";
import { Config } from '../../../../models/config';
import { first } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { Question } from "../../../../models/question";
import { ResponseService } from "../shared-market-report/services/response.service";
import { Tag } from "../../../../models/tag";
import { TagsFiltersService }  from "../shared-market-report/services/tags-filter.service";
import { FilterService } from "../shared-market-report/services/filters.service";

@Component({
  selector: 'shared-follow-up',
  templateUrl: './shared-follow-up.component.html',
  styleUrls: ['./shared-follow-up.component.scss']
})

export class SharedFollowUpComponent implements OnInit {

  @Input() set project(value: Innovation) {
    if (value) {
      this._project = value;
      this._project.followUpEmails = this._project.followUpEmails || {};
      if (this._project.preset && this._project.preset.sections) {
        this._questions = ResponseService.getPresets(this._project);
      }
      this._getAnswers();
    }
  }

  private _config: Config = {
    fields: '',
    limit: '',
    offset: '0',
    search: '{}',
    sort: '{ "created": "-1" }'
  };

  private _project: Innovation = <Innovation> {};

  private _questions: Array<Question> = [];

  private _modalAnswer: Answer = null;

  private _sidebarValue: SidebarInterface = {};

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _tableInfos: Table;

  private _pendingAction: {
    answersIds?: Array<string>,
    objective?: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW'
    assignedAnswers?: Array<{name: string, objective: string}>
  } = {};

  private _customFields: { fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} = {
    en: [],
    fr: []
  };

  private _sidebarTemplate: SidebarInterface = {
    animate_state: 'inactive',
    type: 'follow-up'
  };

  private _modalTemplateType: string = '';

  private _loadingButton: boolean = false;

  private _showEmailsModal: boolean = false;

  private _showWarningModal: boolean = false;

  private _showSendModal: boolean = false;

  private _total: number = -1;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationService: InnovationService,
              private _answerService: AnswerService,
              private _filterService: FilterService,
              private _tagFiltersService: TagsFiltersService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._initializeTable();
  }

  private _initializeTable() {
    this._tableInfos = {
      _selector: 'follow-up-answers',
      _content: this._answers,
      _total: this._total,
      _isSelectable: true,
      _isRowDisabled: (answer: any) => {
        return answer.followUp && answer.followUp.date},
      _isEditable: true,
      _clickIndex: 1,
      _buttons: [
        { _label: 'SHARED_FOLLOW_UP.BUTTON.INTERVIEW'},
        { _label: 'SHARED_FOLLOW_UP.BUTTON.OPENING'},
        { _label: 'SHARED_FOLLOW_UP.BUTTON.NO_FOLLOW'},
        { _label: 'SHARED_FOLLOW_UP.BUTTON.WITHOUT_OBJECTIVE'},
      ],
      _columns: [
        {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.LABEL.NAME', _type: 'TEXT'},
        {_attrs: ['professional.jobTitle'], _name: 'COMMON.LABEL.JOBTITLE', _type: 'TEXT'},
        {_attrs: ['professional.company'], _name: 'COMMON.LABEL.COMPANY', _type: 'TEXT'},
        {_attrs: ['followUp.objective'], _name: 'TABLE.HEADING.OBJECTIVE', _type: 'DROPDOWN',
          _choices: [
            {_name: 'INTERVIEW', _alias: 'SHARED_FOLLOW_UP.BUTTON.INTERVIEW', _class: 'button is-secondary', _disabledClass: 'text-secondary'},
            {_name: 'OPENING', _alias: 'SHARED_FOLLOW_UP.BUTTON.OPENING', _class: 'button is-draft', _disabledClass: 'text-draft'},
            {_name: 'NO_FOLLOW', _alias: 'SHARED_FOLLOW_UP.BUTTON.NO_FOLLOW', _class: 'button is-danger', _disabledClass: 'text-alert'},
            {_name: '', _alias: 'SHARED_FOLLOW_UP.BUTTON.WITHOUT_OBJECTIVE', _class: ''}
          ],
        _disabledState: { _attrs: 'followUp.date', _type: 'DATE' }
        },
      ]
    };
  }

  private _getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._answerService.getInnovationValidAnswers(this._project._id).pipe(first()).subscribe((response) => {

        this._answers = response.answers.map((answer: Answer) => {
          answer.followUp = answer.followUp || {};
          return answer;
        });

        this._total = this._answers.length;
        this._initializeTable();

        this._filterService.filtersUpdate.subscribe(() => {
          this._selectContacts();
        });

        /*
         * compute tag list globally
         */
        const tagsDict = response.answers.reduce(function (acc, answer) {
          answer.tags.forEach((tag) => {
            if (!acc[tag._id]) {
              acc[tag._id] = tag;
            }
          });
          return acc;
        }, {} as {[id: string]: Tag});
        this._tagFiltersService.tagsList = Object.keys(tagsDict).map((k) => tagsDict[k]);

        /*
         * compute tags lists for each questions of type textarea
         */
        this._questions.forEach((question) => {
          const tags = ResponseService.getTagsList(response.answers, question);
          const identifier = (question.controlType === 'textarea') ? question.identifier : question.identifier + 'Comment';
          this._tagFiltersService.setAnswerTags(identifier, tags);
        });

      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });
    }
  }

  public saveProject() {
    this._innovationService.save(this._project._id, this._project).subscribe((response: Innovation) => {
      this._project = response;
      this._translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  private _initializeMailCustomFields() {
    this._customFields = {
      fr: [
        { value: '*|FIRSTNAME|*', label: 'Prénom du pro' },
        { value: '*|LASTNAME|*', label: 'Nom du pro' },
        { value: '*|TITLE|*', label: InnovationFrontService.currentLangInnovationCard(this._project, 'fr', 'title') || 'TITLE'},
        { value: '*|COMPANY_NAME|*', label: this._project.owner && this._project.owner.company ? this._project.owner.company.name : 'COMPANY_NAME' },
        { value: '*|CLIENT_NAME|*', label: this._project.owner ? this._project.owner.name : 'CLIENT_NAME' }
      ],
      en: [
        { value: '*|FIRSTNAME|*', label: 'First name' },
        { value: '*|LASTNAME|*', label: 'Last name' },
        { value: '*|TITLE|*', label: InnovationFrontService.currentLangInnovationCard(this._project, 'en', 'title') || 'TITLE'},
        { value: '*|COMPANY_NAME|*', label: this._project.owner && this._project.owner.company ? this._project.owner.company.name : 'COMPANY_NAME' },
        { value: '*|CLIENT_NAME|*', label: this._project.owner ? this._project.owner.name : 'CLIENT_NAME' }
      ]
    };
  }

  public assignObjective(event: any) {
    const answerId = event.content._id;
    const objective = event.item._name;
    this._answerService.updateLinkingStatus([answerId], objective).subscribe(() => {
      const answerToUpdate = this._answers.findIndex(answer => answer._id === answerId);
      this._answers[answerToUpdate].followUp.objective = objective;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  private _prosByObjective(objective: string, sent: boolean): Array<Answer> {
    objective = objective === 'NOFOLLOW' ? 'NO_FOLLOW': objective;
    return this._answers.filter(answer => !!answer.followUp.date === sent && answer.followUp.objective === objective);
  }

  public closeModal(event: Event) {
    event.preventDefault();
    this._showEmailsModal = false;
    this._showWarningModal = false;
    this._showSendModal = false;
    this._modalTemplateType = '';
  }

  public onClickSee(event: Event, type: string) {
    event.preventDefault();
    this._initializeMailCustomFields();
    this._modalTemplateType = type;
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

    this._innovationService.sendFollowUpEmails(this.project._id).subscribe((value) => {
      this._translateNotificationsService.success('ERROR.PROJECT.SEND_EMAILS', 'ERROR.PROJECT.SEND_EMAILS_OK');
      this._loadingButton = false;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      this._loadingButton = false;
    });
  }

  public sendTestEmails() {
    const objective = this._modalTemplateType;
    this._innovationService.sendFollowUpEmails(this._project._id, objective).subscribe(() => {
      this._translateNotificationsService.success('ERROR.PROJECT.SEND_EMAILS', 'ERROR.PROJECT.SEND_EMAILS_OK');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });
  }

  private _selectContacts() {
    this._filteredAnswers = this._filterService.filter(this._answers);
    const selectedIds = this._filteredAnswers.map(answer => answer._id);
    this._answers.forEach(answer => {
      if (!answer.followUp || !answer.followUp.date) {
        answer._isSelected = selectedIds.indexOf(answer._id) > -1;
      }
    });
  }

  seeAnswer(answer: Answer) {
    this._modalAnswer = answer;

    this._sidebarValue = {
      animate_state: 'active',
      title: 'SIDEBAR.TITLE.EDIT_INSIGHT',
      size: '726px'
    };
  }

  performActions(action: any) {
    const objective = action._action === 'WITHOUT_OBJECTIVE' ? '' : action._action.split('.').slice(-1)[0];
    const answersIds = action._rows.map((answer: any) => answer._id);
    // First we check if some of the selected users already have an objective
    const assignedAnswers = action._rows
      .filter((answer: any) => answer.followUp.objective && answer.followUp.objective != objective)
      .map((answer: any) => {
        return {name: `${answer.professional.firstName} ${answer.professional.lastName}`, objective: answer.followUp.objective};
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
      animate_state: 'inactive',
      type: 'follow-up'
    };
  }

  public updateManyObjectives(answersIds: Array<string>, objective: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW') {
    this._pendingAction = {};
    this._showWarningModal = false;
    this._answerService.updateLinkingStatus(answersIds, objective).subscribe(() => {
      answersIds.forEach((answerId: string) => {
        const answerToUpdate = this._answers.findIndex(answer => answer._id === answerId);
        this._answers[answerToUpdate].followUp.objective = objective;
      });
    });
  }

  set emailsObject(value: any) {
    this._project.followUpEmails[this._modalTemplateType] = value;
  }

  get emailsObject(): any {
    return this._project.followUpEmails[this._modalTemplateType] || { en: {content: '', subject: ''}, fr: {content: '', subject: ''} }
  }

  get project(): Innovation {
    return this._project;
  }

  get customFields(): {fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} {
    return this._customFields;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  set sidebarTemplate(value: SidebarInterface) {
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

  get answers(): Array<Answer> {
    return this._answers;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  set config(value: Config) {
    this._config = value;
  }

  get config(): Config {
    return this._config;
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

  get total(): number {
    return this._total;
  }

  get pendingAction(): {answersIds?: Array<string>, objective?: 'INTERVIEW' | 'OPENING' | 'NO_FOLLOW', assignedAnswers?: Array<{name: string, objective: string}>} {
    return this._pendingAction;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get ccEmail(): string {
    return this._project.followUpEmails.ccEmail;
  }

  set ccEmail(value: string) {
    this._project.followUpEmails.ccEmail = value;
  }

}
