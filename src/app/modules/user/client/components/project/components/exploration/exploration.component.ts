import {Component, Inject, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import { AnswerService } from '../../../../../../../services/answer/answer.service';
import { TranslateNotificationsService } from '../../../../../../../services/translate-notifications/translate-notifications.service';
import { Answer } from '../../../../../../../models/answer';
import { Innovation } from '../../../../../../../models/innovation';
import { SidebarInterface } from '../../../../../../sidebars/interfaces/sidebar-interface';
import { first, takeUntil } from 'rxjs/operators';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../../services/error/error-front.service';
import {isPlatformBrowser} from '@angular/common';
import {Table} from '@umius/umi-common-component';
import {Config} from '../../../../../../../models/config';

@Component({
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})

export class ExplorationComponent implements OnInit, OnDestroy {

  get isFetching(): boolean {
    return this._isFetching;
  }

  private _innovation: Innovation = <Innovation>{};

  private _countries: Array<string> = [];

  private _questions: Array<any> = [];

  private _modalAnswer: Answer = <Answer>{};

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _tableInfos: Table = <Table>{};

  private _anonymousAnswers = false;

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _answers: Array<Answer> = [];

  private _isFetching = true;

  private static _setCountryFlag(answer: Answer) {
    if (!answer.country && answer.professional && answer.professional.country) {
      answer.country = {flag: answer.professional.country};
    }
    if (answer.country && typeof answer.country === 'string') {
      answer.country = {flag: answer.country};
    }
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _answerService: AnswerService,
              private _innovationFrontService: InnovationFrontService,
              private _translateNotificationsService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this._initTable();
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation || <Innovation>{};
      this._getAnswers();
      this._questions = InnovationFrontService.questionsList(this._innovation);
      this._anonymousAnswers = this._innovation._metadata && this._innovation._metadata.campaign
        && this._innovation._metadata.campaign.anonymous_answers;
    });
  }

  private _getAnswers() {
    if (isPlatformBrowser(this._platformId) && this._innovation._id) {
      this._answerService.getInnovationValidAnswers(this._innovation._id, this._anonymousAnswers)
        .pipe(first()).subscribe((response) => {
          this._answers = response && response.answers.map((answer: Answer) => {
            if (!answer.job) {
              answer.job = answer.professional.jobTitle;
            }
            ExplorationComponent._setCountryFlag(answer);
            return answer;
          }) || [];

          this._initTable(this._answers, this._answers.length);

          this._countries = this._answers.reduce((acc: any, answer: any) => {
            if (!!answer.country && !!answer.country.flag &&
              acc.indexOf(answer.country.flag) === -1) {
              acc.push(answer.country.flag);
            }
            return acc;
            }, []);
          this._isFetching = false;
          }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          this._isFetching = false;
          console.error(err);
        });
    }
  }

  private _initTable(answers: Array<Answer> = [], total = -1) {
    if (this._anonymousAnswers) {
      this._tableInfos = {
        _selector: 'client-answer',
        _content: answers,
        _total: total,
        _clickIndex: 1,
        _isLocal: true,
        _isPaginable: true,
        _columns: [
          {_attrs: ['job'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'}
        ]
      };
    } else {
      this._tableInfos = {
        _selector: 'client-answer',
        _content: answers,
        _total: total,
        _clickIndex: 1,
        _isLocal: true,
        _isPaginable: true,
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
          {_attrs: ['job'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'},
          {_attrs: ['country'], _name: 'TABLE.HEADING.COUNTRY', _type: 'COUNTRY', _width: '150px'},
          {_attrs: ['company.name'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT'}
        ]
      };
    }
  }

  public onClickShow(answer: Answer) {
    this._modalAnswer = answer;
    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.INSIGHT',
      size: '726px'
    };
  }

  public percentage(value1: number, value2: number): number {
    if (value2 === 0 || value2 === undefined) {
      return 0;
    } else {
      const percentage = (value2 / value1) * 100;
      return percentage === Infinity ? 0 : Math.floor(percentage);
    }
  }

  get countries() {
    return this._countries;
  }

  get modalAnswer() {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get questions() {
    return this._questions;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

  set sidebarValue(value: SidebarInterface) {
    this._sidebarValue = value;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
