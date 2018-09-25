import { Component, Input, OnInit } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../models/answer';
import { Campaign } from '../../../../../../models/campaign';
import { Clearbit } from '../../../../../../models/clearbit';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';
import { Table } from '../../../../../table/models/table';
import { Template } from '../../../../../sidebar/interfaces/template';
import { FrontendService } from '../../../../../../services/frontend/frontend.service';

@Component({
  selector: 'app-client-exploration-project',
  templateUrl: 'exploration.component.html',
  styleUrls: ['exploration.component.scss']
})

export class ExplorationProjectComponent implements OnInit {

  @Input() project: Innovation;

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

  private _sidebarTemplateValue: Template = {};

  private _tableInfos: Table = null;

  private _config = {
    limit: 10,
    offset: 0,
    search: {},
    sort: {
      created: -1
    }
  };

  constructor(private answerService: AnswerService,
              private innovationService: InnovationService,
              private notificationService: TranslateNotificationsService,
              private frontendService: FrontendService) {}

  ngOnInit() {
    this._contactUrl = encodeURI('mailto:contact@umi.us?subject=' + this.project.name);
    this.loadAnswers();
  }

  loadAnswers() {
    this.answerService.getInnovationValidAnswers(this.project._id).first().subscribe((response: any) => {

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

    }, (error: any) => {
      this.notificationService.error('ERROR.ERROR', error.message);
    });

    this.innovationService.campaigns(this.project._id).first().subscribe((results: any) => {
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
            }, {nbPros: 0, nbProsSent: 0, nbProsOpened: 0, nbProsClicked: 0, nbValidatedResp: 0});
        }
      }, (error: any) => {
        this.notificationService.error('ERROR.ERROR', error.message);
      });


    if (this.project.settings && this.project.settings.companies
        && Array.isArray(this.project.settings.companies.include)) {
      this._companies = this.project.settings.companies.include;
    }

    this._questions = [];

    if (this.project.preset && Array.isArray(this.project.preset.sections)) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }

  }

  seeAnswer(answer: Answer) {
    this._modalAnswer = answer;

    this._sidebarTemplateValue = {
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'MARKET_REPORT.INSIGHT',
      size: '726px'
    };

  }

  closeSidebar(value: string) {
    this._sidebarTemplateValue.animate_state = value;
  }

  public percentageCalculataion(value1: number, value2: number) {
    return this.frontendService.analyticPercentage(value1, value2);
  }

  public formatCompanyName(name: string) {
    if (name) {
      return `${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return '--';
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

  get modalAnswer() {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get questions() {
    return this._questions;
  }

  get projectStatus(): string {
    return this.project.status;
  }

  get sidebarTemplateValue(): Template {
    return this._sidebarTemplateValue;
  }

  get tableInfos(): Table {
    return this._tableInfos;
  }

  get config(): { limit: number; offset: number; search: {}; sort: { created: number } } {
    return this._config;
  }

}
