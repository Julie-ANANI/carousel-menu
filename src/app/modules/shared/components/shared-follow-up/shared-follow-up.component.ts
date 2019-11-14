import { Component, Input, OnInit } from '@angular/core';
import { TranslateNotificationsService } from "../../../../services/notifications/notifications.service";
import { InnovationService } from "../../../../services/innovation/innovation.service";
import { Innovation } from "../../../../models/innovation";
import { InnovationFrontService } from "../../../../services/innovation/innovation-front.service";
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';
import { AnswerService } from "../../../../services/answer/answer.service";
import { Answer } from "../../../../models/answer";
import { Table } from "../../../table/models/table";

@Component({
  selector: 'shared-follow-up',
  templateUrl: './shared-follow-up.component.html',
  styleUrls: ['./shared-follow-up.component.scss']
})

export class SharedFollowUpComponent implements OnInit {

  @Input() set project(value: Innovation) {
    if (value) {
      this._project = value;
      this._initializeMailCustomFields();
    }
  }

  private _config: any = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created": "-1"}'
  };

  private _project: Innovation = <Innovation> {};

  private _answers: Array<Answer> = [];

  private _tableInfos: Table;

  private _customFields: { fr: Array<{label: string, value: string}>, en: Array<{label: string, value: string}>} = {
    en: [],
    fr: []
  };

  private _sidebarTemplate: SidebarInterface = {
    animate_state: 'inactive',
    type: 'follow-up'
  };

  private _modalTemplateType: string = '';

  private _showModal: boolean = false;

  constructor(private _innovationService: InnovationService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService) {}

  ngOnInit() {
    this._answerService.getInnovationValidAnswers(this._project._id).subscribe((response) => {
      this._answers = response.answers.map((answer: Answer) => {
        answer.followUp = answer.followUp || {};
        return answer;
      });
      this._tableInfos = {
        _selector: 'follow-up-answers',
        _content: this._answers,
        _total: this._answers.length,
        _isSearchable: false,
        _isSelectable: true,
        _isEditable: true,
        _clickIndex: 1,
        _buttons: [{_label: 'ANSWER.VALID_ANSWER'}, {_label: 'ANSWER.REJECT_ANSWER'}],
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.LABEL.NAME', _type: 'TEXT'},
          {_attrs: ['professional.jobTitle'], _name: 'COMMON.LABEL.JOBTITLE', _type: 'TEXT'},
          {_attrs: ['professional.company'], _name: 'COMMON.LABEL.COMPANY', _type: 'TEXT'},
          {_attrs: ['followUp.objective'], _name: 'TABLE.HEADING.OBJECTIVE', _type: 'DROPDOWN', _choices: [
              {_name: 'INTERVIEW', _alias: 'INTERVIEW', _class: 'button is-secondary'},
              {_name: 'OPENING', _alias: 'OPENING', _class: 'button is-draft'},
              {_name: 'NO_FOLLOW', _alias: 'NO_FOLLOW', _class: 'button is-danger'}
            ]},
        ]
      };
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR_EN');
    });
  }


  public saveTemplates() {
    this._innovationService.save(this._project._id, this._project).subscribe((response: Innovation) => {
      this._translateNotificationsService.success('ERROR.PROJECT.SUBMITTED', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
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

  public closeModal(event: Event) {
    event.preventDefault();
    this._showModal = false;
    this._modalTemplateType = '';
  }

  public onClickSee(event: Event, type: string) {
    event.preventDefault();
    this._modalTemplateType = type;
    this._showModal = true;
  }

  public onClickDone(event: Event) {
    event.preventDefault();
  }

  public updateCcEmail(email:string) {
    this._project.followUpEmails.ccEmail = email;
  }

  seeAnswer(answer: Answer) {
    console.log(answer);
  }

  performActions(action: any) {
    console.log(action._label);
  }

  set emailsObject(value: any) {
    console.log(value);
    this._project.followUpEmails[this._modalTemplateType] = value;
  }

  get emailsObject(): any {
    return this._modalTemplateType ? this._project.followUpEmails[this._modalTemplateType] : null;
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

  get showModal(): boolean {
    return this._showModal;
  }

  set showModal(value: boolean) {
    this._showModal = value;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): any {
    return this._config;
  }

}
