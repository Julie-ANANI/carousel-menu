/**
 * Created by juandavidcruzgomez on 11/09/2017.
 */
import { Component, OnInit, Input } from '@angular/core';
import { PageScrollConfig } from 'ng2-page-scroll';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { Answer } from '../../../../models/answer';
import { Filter } from './models/filter';
import { Question } from '../../../../models/question';
import { Section } from '../../../../models/section';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { environment} from '../../../../../environments/environment';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

  @Input() public project: Innovation;
  @Input() public adminMode: boolean;

  adminSide: boolean;

  private _questions: Array<Question> = [];
  private _cleaned_questions: Array<Question> = [];
  private _answers: Array<Answer> = [];
  private _filters: {[questionId: string]: Filter} = {};
  private _filteredAnswers: Array<Answer> = [];
  private _countries: Array<string> = [];
  private _showListProfessional = false;
  private _showDetails = false;
  private _innoid: string;

  public today: Number;
  public objectKeys = Object.keys;
  public mapInitialConfiguration: {[continent: string]: boolean};

  private _infographics: any; // TODO remove infographics once conclusions have been migrated to Innovation

  // modalAnswer : null si le modal est fermé,
  // égal à la réponse à afficher si le modal est ouvert
  private _modalAnswer: Answer;

  constructor(private translateService: TranslateService,
              private answerService: AnswerService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private location: Location) { }

  ngOnInit() {

    this.adminSide = this.location.path().slice(0, 6) === '/admin';

    this.today = Date.now();
    this._innoid = this.project._id;
    this.resetMap();

    this.innovationService.getInnovationSythesis(this._innoid).subscribe(synthesis => {
      this._infographics = synthesis.infographics;
      }, error => this.translateNotificationsService.error('ERROR.ERROR', error.message));

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

  private loadAnswers() {
    this.answerService.getInnovationValidAnswers(this._innoid)
      .first().subscribe((results) => {
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

  /**
   * Builds the data required to ask the API for a PDF
   * @returns {{projectId, innovationCardId}}
   */
  public dataBuilder(lang: string): any {
    return {
      projectId: this._innoid,
      title: this.project.name.slice(0, Math.min(20, this.project.name.length)) + '-synthesis(' + lang + ').pdf'
    }
  }

  /*
  public getModel (): any {
    const lang = this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
    return {
      lang: lang,
      jobType: 'synthesis',
      labels: 'EXPORT.INNOVATION.SYNTHESIS',
      pdfDataseedFunction: this.dataBuilder(lang)
    };
  }
  */

  public toggleDetails(event: Event): void {
    event.preventDefault();
    const value = !this._showDetails;
    this._showDetails = value;
    this._showListProfessional = value;
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;
  }

  public filterAnswers(): void {
    let filteredAnswers = this._answers;
    Object.keys(this._filters).forEach((filterKey) => {
      const filter = this._filters[filterKey];
      switch (filter.status) {
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

  // TODO: remove once conclusions have been copied
  public getInfo(question: Question) {
    if (this._infographics) {
      return this._infographics.questions.find((infoQ: any) => infoQ.id === question.identifier);
    } else {
      return null;
    }
  }

  public get logoName(): string {
    return `logo-${ environment.domain || 'umi.us'}.png`;
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

  get infographics () {
    return this._infographics;
  }

  get lang(): string {
    return this.translateService.currentLang || this.translateService.getBrowserLang() || 'en';
  }

}
