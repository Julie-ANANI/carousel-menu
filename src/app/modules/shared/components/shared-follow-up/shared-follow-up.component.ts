import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { Innovation } from '../../../../models/innovation';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { AnswerService } from '../../../../services/answer/answer.service';
import { Answer } from '../../../../models/answer';
import { Table } from '../../../table/models/table';
import { Config } from '../../../../models/config';
import {first/*, takeUntil*/} from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ResponseService } from '../shared-market-report/services/response.service';
import { Tag } from '../../../../models/tag';
import { TagsFiltersService } from '../shared-market-report/services/tags-filter.service';
// import { FilterService } from '../shared-market-report/services/filters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import {MissionQuestion} from '../../../../models/mission';
import {Question} from '../../../../models/question';
import {Subject} from 'rxjs';

/**
 * ADMIN: old version for the admin side
 * CLIENT: added on 1st oct, 2021 for the client side
 */
type template = 'ADMIN' | 'CLIENT' | '';

@Component({
  selector: 'app-shared-follow-up',
  templateUrl: './shared-follow-up.component.html',
  styleUrls: ['./shared-follow-up.component.scss']
})

export class SharedFollowUpComponent implements OnInit {

  set answers(value: Array<Answer>) {
    this._answers = value;
  }

  get startContactProcess(): boolean {
    return this._startContactProcess;
  }

  set startContactProcess(value: boolean) {
    this._startContactProcess = value;
  }

  get subscribe(): Subject<any> {
    return this._subscribe;
  }

  @Input() template: template = '';

  // ex: ['projects', 'project', 'followUp']
  @Input() accessPath: Array<string> = [];

  @Input() set project(value: Innovation) {
    if (value && value._id) {
      this._project = value;
    }
  }

  private _localConfig: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": "-1" }'
  };

  private _project: Innovation = <Innovation>{};

  private _questions: Array<MissionQuestion | Question> = [];

  private _answers: Array<Answer> = [];

  // private _filteredAnswers: Array<Answer> = [];

  private _tableInfos: Table = <Table>{};

  private _subscribe: Subject<any> = new Subject<any>();

  private _startContactProcess = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _answerService: AnswerService,
              // private _filterService: FilterService,
              private _tagFiltersService: TagsFiltersService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit(): void {
    this.initializeTable(this._answers, -1);

    if (this._project && this._project._id) {
      this._project.followUpEmails = this._project.followUpEmails || {};
      this._questions = InnovationFrontService.questionsList(this._project);
      this.getAnswers();
    }
  }

  public initializeTable(answers: Array<Answer> = [], total = 0) {
    switch (this.template) {

      case 'CLIENT':
        this._tableInfos = {
          _selector: 'project-follow-up',
          _content: answers,
          _total: total,
          _clickIndex: 1,
          _isSelectable: this._startContactProcess,
          _isPaginable: true,
          _isLocal: true,
          _isNoMinHeight: answers.length < 11,
          _isRowDisabled: (answer: Answer) => !!(answer.followUp && answer.followUp.date),
          _columns: [
            {
              _attrs: ['professional.lastName'],
              _name: 'COMMON.LABEL.LASTNAME',
              _type: 'TEXT'
            },
            {
              _attrs: ['professional.firstName'],
              _name: 'COMMON.LABEL.FIRSTNAME',
              _type: 'TEXT'
            },
            {
              _attrs: ['professional.jobTitle'],
              _name: 'COMMON.LABEL.JOBTITLE',
              _type: 'TEXT'
            },
            {
              _attrs: ['professional.company.name'],
              _name: 'COMMON.LABEL.COMPANY',
              _type: 'TEXT'
            },
            {
              _attrs: ['country'],
              _name: 'COMMON.LABEL.COUNTRY',
              _type: 'COUNTRY',
              _width: '100px'
            },
            {
              _attrs: ['followUp.date'],
              _name: 'COMMON.LABEL.SEND',
              _type: 'DATE'
            },
          ]
        };
        break;

      case 'ADMIN':
        this._tableInfos = {
          _selector: 'follow-up-answers',
          _content: answers,
          _total: total,
          _isSelectable: this.canAccess(['edit', 'objective']),
          _isRowDisabled: (answer: Answer) => {
            return this.canAccess(['edit', 'objective']) ? answer.followUp && answer.followUp.date
              : false;
          },
          _clickIndex: this.canAccess(['view', 'answer']) || this.canAccess(['edit', 'answer']) ? 1 : null,
          _isPaginable: true,
          _isLocal: true,
          _isNoMinHeight: answers.length < 11,
          _buttons: [
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
        break;
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(this.accessPath);
    }
  }

  public getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._answerService.getInnovationValidAnswers(this._project._id)
        .pipe(first())
        .subscribe((response) => {

          this._answers = response && response.answers && response.answers.map((answer: Answer) => {
            answer.followUp = answer.followUp || {};
            return answer;
          }) || [];

         /* this._filterService.filtersUpdate.pipe(takeUntil(this.subscribe)).subscribe((_) => {
            this._selectContacts();
          });*/
          this.initializeTable(this._answers, this._answers.length);

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
          }, {} as { [id: string]: Tag });

          this._tagFiltersService.tagsList = Object.keys(tagsDict).map((k) => tagsDict[k]);

          /*
           * compute tags lists for each questions of type textarea
           */
          this._questions.forEach((question) => {
            const tags = ResponseService.tagsList(response.answers, question);
            const identifier = (question.controlType === 'textarea') ? question.identifier : question.identifier + 'Comment';
            this._tagFiltersService.setAnswerTags(identifier, tags);
          });

        }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          this.initializeTable([], 0);
          console.error(err);
        });
    }
  }

  /*private _selectContacts() {
    this._filteredAnswers = this._filterService.filter(this._answers);
    const selectedIds = this._filteredAnswers.map(answer => answer._id);
    this._answers.forEach(answer => {
      if (!answer.followUp || !answer.followUp.date) {
        answer._isSelected = selectedIds.indexOf(answer._id) > -1;
      }
    });
  }*/

  get project(): Innovation {
    return this._project;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  set localConfig(value: Config) {
    this._localConfig = value;
  }

  get localConfig(): Config {
    return this._localConfig;
  }

  get questions(): Array<any> {
    return this._questions;
  }

}
