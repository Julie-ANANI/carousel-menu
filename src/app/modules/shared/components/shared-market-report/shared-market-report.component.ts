import {Component, Inject, Input, OnDestroy, OnInit, PLATFORM_ID} from '@angular/core';
import {TranslateNotificationsService} from '../../../../services/notifications/notifications.service';
import {TranslateService} from '@ngx-translate/core';
import {AnswerService} from '../../../../services/answer/answer.service';
import {FilterService} from './services/filters.service';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {Answer} from '../../../../models/answer';
import {Filter} from './models/filter';
import {Question} from '../../../../models/question';
import {Tag} from '../../../../models/tag';
import {Innovation} from '../../../../models/innovation';
import {environment} from '../../../../../environments/environment';
import {SidebarInterface} from '../../../sidebars/interfaces/sidebar-interface';
import {Clearbit} from '../../../../models/clearbit';
import {AuthService} from '../../../../services/auth/auth.service';
import {ResponseService} from './services/response.service';
import {TagsFiltersService} from './services/tags-filter.service';
import {WorldmapFiltersService} from './services/worldmap-filter.service';
import {InnovationFrontService} from '../../../../services/innovation/innovation-front.service';
import {WorldmapService} from '../../../../services/worldmap/worldmap.service';
import {AnswerFrontService} from '../../../../services/answer/answer-front.service';
import {Subject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';
import {RolesFrontService} from '../../../../services/roles/roles-front.service';
import {isPlatformBrowser} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {emptyHtmlRegex} from '../../../../utils/regex';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, OnDestroy {

  @Input() accessPath: Array<string> = [];

  @Input() adminSide = false;

  @Input() reportShared = false;

  @Input() showAnonymousAnswers = false;

  @Input() set project(value: Innovation) {
    if (value && value._id) {
      this._innovation = value;
      this._initializeReport();
      this._isOwner = (this._authService.userId === (this._innovation.owner && this._innovation.owner.id))
        || this._authService.adminLevel > 3;
    }
  }

  private _innovation: Innovation = <Innovation>{};

  private _isOwner = false;

  private _previewMode = false;

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _answersOrigins: {[continent: string]: {count: number, countries: {[country: string]: number}}} = {};

  private _countries: Array<string> = [];

  private _answersByCountries: any = {};

  private _questions: Array<Question> = [];

  private _toggleAnswers = false;

  private _modalAnswer: Answer = <Answer>{};

  private _leftSidebarTemplateValue: SidebarInterface = {
    animate_state: 'active',
    type: 'MARKET_REPORT'
  };

  private _sidebarTemplateValue: SidebarInterface = <SidebarInterface>{};

  private _companies: Array<Clearbit> = [];

  private _toggleProfessional = false;

  private _anonymousAnswers = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _toBeSaved = false;

  private _isMainDomain = environment.domain === 'umi';

  public areAnswersLoading = false;

  public displayFilters = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _rolesFrontService: RolesFrontService,
              private _innovationFrontService: InnovationFrontService,
              private _filterService: FilterService,
              private _tagFiltersService: TagsFiltersService,
              private _sharedWorldMapService: WorldmapService,
              private _worldmapFiltersService: WorldmapFiltersService) { }

  ngOnInit() {
    this._filterService.reset();

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((value) => {
        this._toBeSaved = !!(value && value.state);
      });
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(this.accessPath.concat(path));
  }

  /***
   * This function is calling all the initial functions.
   */
  private _initializeReport() {
    this._anonymousAnswers = !!(this._innovation._metadata && this._innovation._metadata.campaign
      && this._innovation._metadata.campaign.anonymous_answers);

    this._getAnswers();

    // this is to check, if the admin make the synthesis available before the status is Done.
    this._previewMode = this._innovation.previewMode ? this._innovation.previewMode : false;

    this._worldmapFiltersService.reset();
    this._questions = ResponseService.presets(this._innovation);
  }

  /***
   * This function is to fetch the answers from the server.
   */
  private _getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this.areAnswersLoading = true;
      this._answerService.getInnovationValidAnswers(this._innovation._id, this._anonymousAnswers).pipe(first())
        .subscribe((response) => {
          this._answers = AnswerFrontService.qualitySort(response.answers);

          if (this._anonymousAnswers) {
            this._answers = AnswerFrontService.anonymous(this._answers);
          }

          this._filteredAnswers = this._answers;
          this._updateAnswersToShow();

          this._filterService.filtersUpdate.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() =>
            this._updateAnswersToShow()
          );

          this._companies = response.answers.map((answer: any) => answer.company || {
            name: answer.professional.company
          }).filter(function(item: any, pos: any, self: any) {
            return self.findIndex((subitem: Clearbit) => subitem.name === item.name) === pos;
          });

          this._countries = response.answers.reduce((acc, answer) => {
            if (!!answer.country && !!answer.country.flag && acc.indexOf(answer.country.flag) === -1) {
              acc.push(answer.country.flag);
            }
            return acc;
          }, []);

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
            const tags = ResponseService.tagsList(response.answers, question);
            const identifier = (question.controlType === 'textarea') ? question.identifier
              : question.identifier + 'Comment';
            this._tagFiltersService.setAnswerTags(identifier, tags);
          });

          this.areAnswersLoading = false;
          setTimeout(() => this.displayFilters = true, 500);

        }, (err: HttpErrorResponse) => {
          this.areAnswersLoading = false;
          this.displayFilters = true;
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          console.error(err);
        });
    }
  }

  private _updateAnswersToShow(): void {
    const addAnswer = (country: string) => {
      if (this._answersByCountries[country]) {
        this._answersByCountries[country] += 1;
      } else {
        this._answersByCountries[country] = 1;
      }
    };
    this._answersByCountries = {};
    this._filteredAnswers = this._filterService.filter(this._answers);
    const countriesList = this._filteredAnswers.map(function (answer: Answer): string {
      let answerIsAlreadyCounted = false;
      if (!!answer.country && !!answer.country.flag) {
        answerIsAlreadyCounted = true;
        addAnswer(answer.country.flag);
        return answer.country.flag;
      }
      if (!!answer.professional && !!answer.professional.country) {
        if (!answerIsAlreadyCounted) { addAnswer(answer.professional.country); }
        return answer.professional.country;
      }
      return '';
    });

    this._sharedWorldMapService.getCountriesRepartitionByContinent(countriesList).then(r => this._answersOrigins = r);
  }

  /***
   * This function saves the comment of the operator.
   * @param event
   * @param {string} ob
   */
  public saveOperatorComment(event: {content: string}, ob: string) {
    this._innovation.marketReport[ob] = { conclusion: event.content };
    this._innovationFrontService.setNotifyChanges({key: 'marketReport', state: true});
  }

  public saveInnovation(event: Event) {
    event.preventDefault();
    this._innovationService.save(this._innovation._id, {marketReport: this._innovation.marketReport}).subscribe(() => {
      this._toBeSaved = false;
      this._translateNotificationsService.success('Success', 'The synthesis has been saved.');
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public filterPro(answer: Answer, event: Event) {
    event.preventDefault();
    let proFiltered: any = {};
    if (this._filterService.filters['professionals']) {
      proFiltered = this._filterService.filters['professionals'].value;
    }
    proFiltered[answer._id] = answer;
    this._filterService.addFilter({
      status: 'PROFESSIONALS',
      value: proFiltered,
      questionId: 'professionals'
    });
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;
    this._sidebarTemplateValue = {
      animate_state: 'active',
      title: 'Insight',
      size: '726px'
    };
  }

  public get userLang(): string {
    return this._translateService.currentLang;
  }

  get previewMode(): boolean {
    return this._previewMode;
  }

  get toggleAnswers(): boolean {
    return this._toggleAnswers;
  }

  get filters(): {[questionId: string]: Filter} {
    return this._filterService.filters;
  }

  get companies() {
    return this._companies;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get filteredAnswers(): Array<Answer> {
    return this._filteredAnswers;
  }

  get countries(): Array<string> {
    return this._countries;
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

  get leftSidebarTemplateValue(): SidebarInterface {
    return this._leftSidebarTemplateValue;
  }

  set leftSidebarTemplateValue(value: SidebarInterface) {
    this._leftSidebarTemplateValue = value;
  }

  get sidebarTemplateValue(): SidebarInterface {
    return this._sidebarTemplateValue;
  }

  set sidebarTemplateValue(value: SidebarInterface) {
    this._sidebarTemplateValue = value;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get answersOrigins(): {[continent: string]: {count: number, countries: {[country: string]: number}}} {
    return this._answersOrigins;
  }

  get answersByCountries(): boolean {
    return this._answersByCountries;
  }

  get toggleProfessional(): boolean {
    return this._toggleProfessional;
  }

  set toggleProfessional(value: boolean) {
    this._toggleProfessional = value;
  }

  get toBeSaved(): boolean {
    return this._toBeSaved;
  }

  get isMainDomain(): boolean {
    return this._isMainDomain;
  }

  hideQuestionAnswers(question: Question) {
    return this.showAnonymousAnswers && (question.sensitiveAnswerData || question.identifier.includes('contact'));
  }

  showSection(sectionText: string) {
    return (sectionText && !emptyHtmlRegex.test(sectionText)) || this.adminSide;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
