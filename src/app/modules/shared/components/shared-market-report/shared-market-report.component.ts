import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { FilterService } from './services/filters.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Answer } from '../../../../models/answer';
import { Filter } from './models/filter';
import { Question } from '../../../../models/question';
import { Tag } from '../../../../models/tag';
import { Innovation } from '../../../../models/innovation';
import { environment } from '../../../../../environments/environment';
import { SidebarInterface } from '../../../sidebars/interfaces/sidebar-interface';
import { Clearbit } from '../../../../models/clearbit';
import { AuthService } from '../../../../services/auth/auth.service';
import { ResponseService } from './services/response.service';
import { TagsFiltersService } from './services/tags-filter.service';
import { WorldmapFiltersService } from './services/worldmap-filter.service';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import { SharedWorldmapService } from '../shared-worldmap/services/shared-worldmap.service';
import { AnswerFrontService } from '../../../../services/answer/answer-front.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, OnDestroy {

  @Input() set adminMode(value: boolean) {
    this._adminMode = value;
  }

  @Input() set project(value: Innovation) {
    if (value) {
      this._innovation = value;
      this._initializeReport();
      this._isOwner = (this._authService.userId === this._innovation.owner.id) || this._authService.adminLevel > 2;
    }
  }

  @Input() set reportShared(value: boolean) {
    this._reportShared = value;
  }

  @Input() set adminSide(value: boolean) {
    this._adminSide = value;
  }

  private _innovation: Innovation = {};

  private _reportShared: boolean;

  private _adminSide: boolean;

  private _isOwner: boolean;

  private _previewMode: boolean;

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _answersOrigins: {[c: string]: number} = {};

  private _countries: Array<string> = [];

  private _answersByCountries: any = {};

  private _questions: Array<Question> = [];

  private _adminMode: boolean;

  private _toggleAnswers: boolean;

  private _modalAnswer: Answer = null;

  private _leftSidebarTemplateValue: SidebarInterface = {
    animate_state: 'active',
    type: 'market-report'
  };

  private _sidebarTemplateValue: SidebarInterface = {};

  private _companies: Array<Clearbit>;

  private _toggleProfessional: boolean;

  private _anonymousAnswers: boolean = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _toBeSaved = false;

  constructor(private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _innovationFrontService: InnovationFrontService,
              private _filterService: FilterService,
              private _tagFiltersService: TagsFiltersService,
              private _sharedWorldMapService: SharedWorldmapService,
              private _worldmapFiltersService: WorldmapFiltersService) { }

  ngOnInit() {
    this._filterService.reset();

    this._innovationFrontService.getNotifyChanges().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value) => {
      this._toBeSaved = value;
    });

  }


  /***
   * This function is calling all the initial functions.
   */
  private _initializeReport() {
    this._initializeVariable();
    this._getAnswers();
    this.resetMap();
    this.presets();
  }


  /***
   *This function is to initialize the variables regarding the innovation and the projectt.
   */
  private _initializeVariable() {

    /***
     * this is to check, if the admin make the synthesis available before the status is Done.
     * @type {boolean | undefined}
     * @user
     */
    this._previewMode = this._innovation.previewMode ? this._innovation.previewMode : false;

    this._anonymousAnswers = !!this._innovation._metadata.campaign.anonymous_answers && !this._adminMode;

  }


  private _updateAnswersToShow(): void {
    const addAnswer = (country: string) => {
      if(this._answersByCountries[country]) {
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
        if (!answerIsAlreadyCounted) addAnswer(answer.professional.country);
        return answer.professional.country;
      }
      return '';
    });
    this._answersOrigins = this._sharedWorldMapService.getCountriesRepartition(countriesList);
  }


  /***
   * This function is to fetch the answers from the server.
   */
  private _getAnswers() {
    this._answerService.getInnovationValidAnswers(this._innovation._id, this._anonymousAnswers).subscribe((response) => {
      this._answers = AnswerFrontService.qualitySort(response.answers);

      if( this._anonymousAnswers ) {
        this._answers = AnswerFrontService.anonymous(this._answers);
      }

      this._filteredAnswers = this._answers;
      this._updateAnswersToShow();
      this._filterService.filtersUpdate.subscribe(() => this._updateAnswersToShow());

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
        const identifier = (question.controlType === 'textarea') ? question.identifier : question.identifier + 'Comment';
        this._tagFiltersService.setAnswerTags(identifier, tags);
      });

    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  /***
   * This function is to reset the map configuration.
   */
  private resetMap() {
    this._worldmapFiltersService.reset();
  }


  /***
   * This function is to get the questions.
   */
  private presets() {
   if (this._innovation.preset && this._innovation.preset.sections) {
     this._questions = ResponseService.presets(this._innovation);
   }
  }

  /***
   * This function returns the color according to the length of the input data.
   * @param {number} length
   * @param {number} limit
   * @returns {string}
   */
  public getColor(length: number, limit: number) {
    return InnovationFrontService.getColor(length, limit);
  }

  /***
   * This function saves the comment of the operator.
   * @param event
   * @param {string} ob
   */
  public saveOperatorComment(event: {content: string}, ob: string) {
    this._innovation.marketReport[ob] = { conclusion: event.content };
    this._innovationFrontService.setNotifyChanges(true);
  }

  public saveInnovation(event: Event) {
    event.preventDefault();
    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
      this._toBeSaved = false;
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }


  /***
   * This function is to filter by the countries.
   * @param event
   */
  filterByContinents(event: {continents: {[continent: string]: boolean}, allChecked: boolean}): void {
    this._worldmapFiltersService.selectContinents(event);
  }


  filterPro(answer: Answer, event: Event) {
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

  public closeSidebar() {
    this._leftSidebarTemplateValue = {
      animate_state: 'inactive',
      type: 'market-report'
    };
  }


  public get mainDomain(): boolean {
    return environment.domain === 'umi';
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

  get continentTarget(): any {
    return this._innovation.settings ? this._innovation.settings.geography.continentTarget : {};
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

  get adminSide(): boolean {
    return this._adminSide;
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

  get reportShared(): boolean {
    return this._reportShared;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get mapSelectedContinents(): { [p: string]: boolean } {
    return this._worldmapFiltersService.selectedContinents;
  }

  get answersOrigins(): {[c: string]: number} {
    return this._answersOrigins;
  }

  get adminMode(): boolean {
    return this._adminMode;
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

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
