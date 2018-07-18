import { Component, Input, OnInit } from '@angular/core';
import { AnswerService } from '../../../../../../services/answer/answer.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { Answer } from '../../../../../../models/answer';
import { Clearbit } from '../../../../../../models/clearbit';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { Section } from '../../../../../../models/section';
import { Table } from '../../../../../shared/components/shared-table/models/table';
import { Template } from '../../../../../shared/components/shared-sidebar/interfaces/template';

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
    nbProsClicked: number
  };
  private _companies: Array<Clearbit>;
  private _countries: Array<string>;
  private _questions: Array<Question>;
  private _modalAnswer: Answer;
  sidebarTemplateValue: Template = {};

  tableInfos: Table = null;

  constructor(private answerService: AnswerService,
              private innovationService: InnovationService,
              private notificationService: TranslateNotificationsService) {
  }

  ngOnInit() {
    this._contactUrl = encodeURI('mailto:contact@umi.us?subject=' + this.project.name);
    this.loadAnswers();
  }

  loadAnswers() {
    this.answerService.getInnovationValidAnswers(this.project._id).first().subscribe( (response) => {

      this.tableInfos = {
        _selector: 'client-answer',
        _content: response.answers,
        _isShowable: true,
        _isNotPaginable: true,
        _total: response.answers.length,
        _columns: [
          {_attrs: ['professional.firstName', 'professional.lastName'], _name: 'COMMON.NAME', _type: 'TEXT', _isSortable: false},
          {_attrs: ['job'], _name: 'COMMON.JOBTITLE', _type: 'TEXT', _isSortable: false},
        ]
      };

      this._companies = response.answers.map((answer: any) => answer.company || {
        name: answer.professional.company
      }).filter(function(item: any, pos: any, self: any) {
        // this is here to remove duplicate
        return self.findIndex((subitem: Clearbit) => subitem.name === item.name) === pos;
      });

      this._countries = response.answers.reduce((acc: any, answer: any) => {
        if (acc.indexOf(answer.country.flag) === -1) {
          acc.push(answer.country.flag);
        }
        return acc;
      }, []);

    }, (error) => {
      this.notificationService.error('ERROR.ERROR', error.message);
    });

    this._campaignsStats = {nbPros: 0, nbProsSent: 0, nbProsOpened: 0, nbProsClicked: 0};

    this.innovationService.campaigns(this.project._id).first()
      .subscribe((results) => {
        if (results && Array.isArray(results.result)) {
          this._campaignsStats = results.result
            .reduce(function(acc, campaign) {
              if (campaign.stats) {
                if (campaign.stats.campaign) {
                  acc.nbPros += (campaign.stats.campaign.nbProfessionals || 0);
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
            }, {nbPros: 0, nbProsSent: 0, nbProsOpened: 0, nbProsClicked: 0});
        }
      }, (error) => {
        this.notificationService.error('ERROR.ERROR', error.message);
      });
    this._questions = [];
    if (this.project.preset && Array.isArray(this.project.preset.sections)) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions || []);
      });
    }

  }

  get projectStatus(): string {
    return this.project.status;
  }

  seeAnswer(answer: Answer) {
    this._modalAnswer = answer;

    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'MARKET_REPORT.INSIGHT',
      size: '726px'
    };

  }

  public formatCompanyName(name: string) {
    if (name) {
      return `${name[0].toUpperCase()}${name.slice(1)}`;
    }
    return '--';
  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
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



}
