import { Component, OnInit, Input, AfterViewInit, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { PageScrollConfig } from 'ng2-page-scroll';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Answer } from '../../../../models/answer';
import { Filter } from './models/filter';
import { Question } from '../../../../models/question';
import { Section } from '../../../../models/section';
import { Tag } from '../../../../models/tag';
import { Innovation } from '../../../../models/innovation';
import { environment} from '../../../../../environments/environment';
import { Subject } from 'rxjs/Subject';
import {Template} from '../../../sidebar/interfaces/template';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, AfterViewInit {

  @Input() project: Innovation;
  @Input() adminMode: boolean;

  adminSide: boolean;
  editMode = new Subject<boolean>();
  sidebarTemplateValue: Template = {};
  scrollOn = false;
  activeSection: string;
  today: Number;
  objectKeys = Object.keys;
  mapInitialConfiguration: {[continent: string]: boolean};

  private _questions: Array<Question> = [];
  private _cleaned_questions: Array<Question> = [];
  private _answers: Array<Answer> = [];
  private _filters: {[questionId: string]: Filter} = {};
  private _filteredAnswers: Array<Answer> = [];
  private _countries: Array<string> = [];
  private _showListProfessional = true;
  private _showDetails = true;
  private _innoid: string;
  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private translateNotificationsService: TranslateNotificationsService,
              private location: Location,
              private innovationService: InnovationService) {}

  ngOnInit() {

    this.adminSide = this.location.path().slice(0, 6) === '/admin';

    this.today = Date.now();

    this._innoid = this.project._id;

    this.resetMap();

    this.loadAnswers();

    if (this.project.preset && this.project.preset.sections) {
      this.project.preset.sections.forEach((section: Section) => {
        this._questions = this._questions.concat(section.questions);
      });

      // remove spaces in questions identifiers.
      this._cleaned_questions = this._questions.map((q) => {
        const ret = JSON.parse(JSON.stringify(q));
        // Please don't touch the parse(stringify()), this dereference q to avoid changing _questions list
        // If changed, the answer modal won't have the good questions identifiers because _questions will be modified
        ret.identifier = ret.identifier.replace(/\s/g, '');
        return ret;
      });

    }

    this._modalAnswer = null;

    PageScrollConfig.defaultDuration = 800;

  }

  ngAfterViewInit() {
    const wrapper = document
      .getElementById('answer-wrapper');
    if (wrapper) {
      const sections = Array.from(
        wrapper.querySelectorAll('section')
      );
      window.onscroll = () => {
        const scrollPosY = document.body.scrollTop;
        const section = sections.find((n) => scrollPosY <= n.getBoundingClientRect().bottom);
        this.activeSection = section ? section.id : '';
      };
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY !== 0) {
      this.scrollOn = true;
    } else {
      this.scrollOn = false;
    }
  }


  private loadAnswers() {
    this.answerService.getInnovationValidAnswers(this._innoid).first()
      .subscribe((results) => {
        this._answers = results.answers.sort((a, b) => {
            return b.profileQuality - a.profileQuality;
          });

        this._filteredAnswers = this._answers;

        this._countries = results.answers.reduce((acc, answer) => {
            if (acc.indexOf(answer.country.flag) === -1) {
              acc.push(answer.country.flag);
            }
            return acc;
          }, []);

      }, (error) => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      });
  }

  public changeStatus(event: Event, status: 'EVALUATING' | 'DONE'): void {
    this.innovationService
      .updateStatus(this.innoid, status)
      .first().subscribe((results) => {
        this.translateNotificationsService.success('ERROR.SUCCESS', '');
      }, (error) => {
        this.translateNotificationsService.error('ERROR.ERROR', error.message);
      });
  }

  public toggleDetails(event: Event): void {
    event.preventDefault();
    const value = !this._showDetails;
    this._showDetails = value;
    this._showListProfessional = value;
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;

    this.sidebarTemplateValue = {
      animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: this.adminSide ? 'COMMON.EDIT_INSIGHT' : 'MARKET_REPORT.INSIGHT',
      size: '726px'
    };

  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
    this.editMode.next(false);
  }

  public filterAnswers(): void {
    let filteredAnswers = this._answers;
    Object.keys(this._filters).forEach((filterKey) => {
      const filter = this._filters[filterKey];
      switch (filter.status) {
        case 'TAG':
          filteredAnswers = filteredAnswers.filter((answer) => {
            if (filter.questionId && Array.isArray(answer.answerTags[filter.questionId])) {
              return answer.answerTags[filter.questionId].some((t: Tag) => t._id === filter.value);
            } else if (!filter.questionId) {
              return answer.tags.some((t: Tag) => t._id === filter.value);
            } else {
              return false;
            }
          });
          break;
        case 'CHECKBOX':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return answer.answers[filter.questionId] && answer.answers[filter.questionId][filter.value];
          });
          break;
        case 'CLEARBIT':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return Array.isArray(answer.answers[filter.questionId]) &&
              answer.answers[filter.questionId].some((item: any) => item.name === filter.value);
          });
          break;
        case 'COUNTRIES':
          filteredAnswers = filteredAnswers.filter((answer) => {
            const country = answer.country.flag || answer.professional.country;
            return filter.value.some((c: string) => c === country);
          });
          break;
        case 'LIST':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return Array.isArray(answer.answers[filter.questionId]) &&
              answer.answers[filter.questionId].some((item: any) => item.text === filter.value);
          });
          break;
        case 'RADIO':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return answer.answers[filter.questionId] === filter.value;
          });
          break;
        default:
          console.log(`Unknown filter type: ${filter.status}.`);
      }
    });
    this._filteredAnswers = filteredAnswers;
  }

  public resetMap() {
    this.mapInitialConfiguration = {
      africa: true,
      americaNord: true,
      americaSud: true,
      asia: true,
      europe: true,
      oceania: true,
      russia: true
    };
  }

  public filterByCountries(event: {countries: Array<string>, allChecked: boolean}): void {
    if (!event.allChecked) {
      this._filters['worldmap'] = {
        status: 'COUNTRIES',
        value: event.countries,
        questionTitle: {en: 'worldmap', fr: 'mappemonde'}
      };
    } else {
      delete this._filters['worldmap'];
    }
    this.filterAnswers();
  }

  public addFilter(event: Filter) {
    this._filters[event.questionId] = event;
    this.filterAnswers();
  }

  public deleteFilter(key: string, event: Event) {
    event.preventDefault();
    delete this._filters[key];
    if (key === 'worldmap') {
      this.resetMap();
    }
    this.filterAnswers();
  }

  public print(event: Event): void {
    event.preventDefault();
    window.print();
  }

  get logoName(): string {
    return environment.logoSynthURL;
  }

  get projectStatus(): string {
    return this.project.status;
  }


  get answers(): Array<Answer> {
    return this._answers;
  }

  get filters() {
    return this._filters;
  }

  get filteredAnswers(): Array<Answer> {
    return this._filteredAnswers;
  }


  get countries(): Array<string> {
    return this._countries;
  }

  get cleaned_questions(): Array<Question> {
    return this._cleaned_questions;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get modalAnswer(): Answer {
    return this._modalAnswer;
  }

  set modalAnswer(modalAnswer: Answer) {
    this._modalAnswer = modalAnswer;
  }

  get showListProfessional(): boolean {
    return this._showListProfessional;
  }

  set showListProfessional(val: boolean) {
    this._showListProfessional = val;
  }

  get innoid(): string {
    return this._innoid;
  }

  get showDetails (): boolean {
    return this._showDetails;
  }

  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

  getLogo(): string {
    return environment.logoURL;
  }

}
