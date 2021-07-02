import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../../../../services/answer/answer.service';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../../models/answer';
import { Campaign } from '../../../../../../../models/campaign';
import { Innovation } from '../../../../../../../models/innovation';
import { Question } from '../../../../../../../models/question';
import { Section } from '../../../../../../../models/section';
import { Table } from '../../../../../../table/models/table';
import { SidebarInterface } from '../../../../../../sidebars/interfaces/sidebar-interface';
import { first, takeUntil } from 'rxjs/operators';
import { Config } from '../../../../../../../models/config';
import { InnovationFrontService } from '../../../../../../../services/innovation/innovation-front.service';
import { Subject } from 'rxjs';

@Component({
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})

export class ExplorationComponent implements OnInit, OnDestroy {

  private _innovation: Innovation = <Innovation>{};

  private _campaignsStats: {
    nbPros: number,
    nbProsSent: number,
    nbProsOpened: number,
    nbProsClicked: number,
    nbValidatedResp: number
  };

  private _countries: Array<string> = [];

  private _questions: Array<Question> = [];

  private _modalAnswer: Answer = <Answer>{};

  private _sidebarValue: SidebarInterface = {
    animate_state: 'inactive'
  };

  private _tableInfos: Table = <Table>{};

  private _anonymousAnswers: boolean = false;

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _ngUnsubscribe: Subject<any> = new Subject();

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private _innovationFrontService: InnovationFrontService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._innovationFrontService.innovation().pipe(takeUntil(this._ngUnsubscribe)).subscribe((innovation) => {
      this._innovation = innovation;
      this._anonymousAnswers = this._innovation._metadata && this._innovation._metadata.campaign
        && this._innovation._metadata.campaign.anonymous_answers;
      if (this._innovation._id) {
        this.loadAnswers();
      }
    });
  }

  loadAnswers() {
    this.answerService.getInnovationValidAnswers(this._innovation._id, this._anonymousAnswers).pipe(first()).subscribe((response: any) => {
      response.answers.map((answer: Answer) => {
        if (!answer.job) {
          answer.job = answer.professional.jobTitle;
        }
        return answer;
      });
      if (this._anonymousAnswers) {
        this._tableInfos = {
          _selector: 'client-answer',
          _content: response.answers,
          _total: response.answers.length,
          _clickIndex: 1,
          _isLocal: true,
          _isPaginable: true,
          _columns: [
            {_attrs: ['job'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'},
            {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
          ]
        };
      } else {
        this._tableInfos = {
          _selector: 'client-answer',
          _content: response.answers,
          _total: response.answers.length,
          _clickIndex: 1,
          _isLocal: true,
          _isPaginable: true,
          _columns: [
            {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'TABLE.HEADING.NAME', _type: 'TEXT'},
            {_attrs: ['job'], _name: 'TABLE.HEADING.JOB_TITLE', _type: 'TEXT'},
            {_attrs: ['company.name'], _name: 'TABLE.HEADING.COMPANY', _type: 'TEXT'},
            {_attrs: ['created'], _name: 'TABLE.HEADING.CREATED', _type: 'DATE'},
          ]
        };
      }

      this._countries = response.answers.reduce((acc: any, answer: any) => {
        if (!!answer.country &&
          !!answer.country.flag &&
          acc.indexOf(answer.country.flag) === -1) {
          acc.push(answer.country.flag);
        }
        return acc;
      }, []);

    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });

    this.innovationService.campaigns(this._innovation._id).pipe(first()).subscribe((results: any) => {
        if (results && Array.isArray(results.result)) {
          this._campaignsStats = results.result.reduce(function(acc: any, campaign: Campaign) {
              if (campaign.stats) {
                if (campaign.stats.campaign) {
                  acc.nbPros += (campaign.stats.campaign.nbProfessionals || 0);
                  acc.nbValidatedResp += (campaign.stats.campaign.nbValidatedResp || 0);
                }
                if (campaign.stats.mail) {
                  acc.nbProsSent += (campaign.stats.mail.totalPros ||  0);
                  if (campaign.stats.mail.statuses) {
                    acc.nbProsOpened += (campaign.stats.mail.statuses.opened || 0);
                    acc.nbProsClicked += (campaign.stats.mail.statuses.clicked ||  0);
                  }
                }
              }
              return acc;
            }, { nbPros: 0, nbProsSent: 0, nbProsOpened: 0, nbProsClicked: 0, nbValidatedResp: 0 });
        }
      }, () => {
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });

    this._questions = [];

    if (this._innovation.preset && Array.isArray(this._innovation.preset.sections)) {
      this._innovation.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }

  }


  onClickShow(answer: Answer) {
    this._modalAnswer = answer;

    this._sidebarValue = {
      animate_state: this._sidebarValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'SIDEBAR.TITLE.INSIGHT',
      size: '726px'
    };

  }


  percentage(value1: number, value2: number): number {
    if (value2 === 0 || value2 === undefined) {
      return 0;
    } else {
      const percentage = (value2 / value1) * 100;
      return percentage === Infinity ? 0 : Math.floor(percentage);
    }
  }

  get campaignStats() {
    return this._campaignsStats;
  }

  get countries() {
    return this._countries;
  }

  get dateFormat(): string {
    return this.translateService.currentLang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
