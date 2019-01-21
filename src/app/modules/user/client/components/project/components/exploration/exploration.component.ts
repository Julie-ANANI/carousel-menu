import {Component, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { AnswerService } from '../../../../../../../services/answer/answer.service';
import { InnovationService } from '../../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../../models/answer';
import { Campaign } from '../../../../../../../models/campaign';
import { Clearbit } from '../../../../../../../models/clearbit';
import { Innovation } from '../../../../../../../models/innovation';
import { Question } from '../../../../../../../models/question';
import { Section } from '../../../../../../../models/section';
import { Table } from '../../../../../../table/models/table';
import { SidebarInterface } from '../../../../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-exploration',
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})

export class ExplorationComponent implements OnInit {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  private _innovation: Innovation = {};

  private _contactUrl: string;

  private _campaignsStats: {
    nbPros: number,
    nbProsSent: number,
    nbProsOpened: number,
    nbProsClicked: number,
    nbValidatedResp: number
  };

  private _companies: Array<Clearbit>;

  private _countries: Array<string>;

  private _questions: Array<Question>;

  private _modalAnswer: Answer;

  private _sidebarValue: SidebarInterface = {};

  private _tableInfos: Table = null;

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    this._contactUrl = encodeURI('mailto:contact@umi.us?subject=' + this._innovation.name);
    this.loadAnswers();
  }

  loadAnswers() {
    this.answerService.getInnovationValidAnswers(this._innovation._id).pipe(first()).subscribe((response: any) => {

      this._tableInfos = {
        _selector: 'client-answer',
        _content: response.answers,
        _isShowable: true,
        _isLocal: true,
        _total: response.answers.length,
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.NAME', _type: 'TEXT'},
          {_attrs: ['job'], _name: 'COMMON.JOBTITLE', _type: 'TEXT'},
          {_attrs: ['company.name'], _name: 'COMMON.COMPANY', _type: 'TEXT'},
          {_attrs: ['created'], _name: 'COMMON.DATE', _type: 'DATE'},
        ]
      };

      this._countries = response.answers.reduce((acc: any, answer: any) => {
        if (acc.indexOf(answer.country.flag) === -1) {
          acc.push(answer.country.flag);
        }
        return acc;
      }, []);

    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
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
        this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
      });


    if (this._innovation.settings && this._innovation.settings.companies
        && Array.isArray(this._innovation.settings.companies.include)) {
      this._companies = this._innovation.settings.companies.include;
    }

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
      title: 'MARKET_REPORT.INSIGHT',
      size: '726px'
    };

  }

  closeSidebar(value: SidebarInterface) {
    this._sidebarValue.animate_state = value.animate_state;
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

  get companies() {
    return this._companies;
  }

  get countries() {
    return this._countries;
  }

  get contactUrl() {
    return this._contactUrl;
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

  get config(): { limit: number; offset: number; search: {}; sort: { created: number } } {
    return this._config;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sidebarValue(): SidebarInterface {
    return this._sidebarValue;
  }

}
