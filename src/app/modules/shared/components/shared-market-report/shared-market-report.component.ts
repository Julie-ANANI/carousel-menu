import { Component, OnInit, Inject, Input, OnDestroy, PLATFORM_ID } from '@angular/core';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { AnswerService } from '../../../../services/answer/answer.service';
import { FilterService } from './services/filters.service';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Answer } from '../../../../models/answer';
import { Campaign } from '../../../../models/campaign';
import { Filter } from './models/filter';
import { Question } from '../../../../models/question';
import { Innovation } from '../../../../models/innovation';
import { environment } from '../../../../../environments/environment';
import { SidebarInterface } from '../../../sidebar/interfaces/sidebar-interface';
import { Clearbit } from '../../../../models/clearbit';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject } from 'rxjs';
import { Executive, executiveTemplate } from './models/template';
import { ResponseService } from './services/response.service';
import { TagsFiltersService } from './services/tags-filter.service';
import { SharedWorldmapService } from '../shared-worldmap/shared-worldmap.service';
import { WorldmapFiltersService } from './services/worldmap-filter.service';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit, OnDestroy {

  @Input() set project(value: Innovation) {
    this._innovation = value;
  }

  @Input() set modeAdmin(value: boolean) {
    this._adminMode = value;
  }

  @Input() set sideAdmin(value: boolean) {
    this._adminSide = value;
  }

  @Input() wordpress = false; // this is temporary for the site.

  private _ngUnsubscribe: Subject<any> = new Subject();

  private _innovation: Innovation = {};

  private _adminSide = false;

  private _isOwner: boolean;

  private _previewMode: boolean;

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _answersOrigins: {[c: string]: number} = {};

  private _countries: Array<string> = [];

  private _questions: Array<Question> = [];

  private _adminMode: boolean = false;

  private _campaignsStats: {
    nbPros: number,
    nbProsSent: number,
    nbProsOpened: number,
    nbProsClicked: number,
    nbValidatedResp: number
  };

  private _toggleAnswers: boolean = false;

  private _numberOfSections: number;

  private _executiveTemplates: Array<Executive>;

  private _modalAnswer: Answer = null;

  private _sidebarTemplateValue: SidebarInterface = {};

  private _companies: Array<Clearbit>;

  private _toggleProfessional: boolean = false;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _filterService: FilterService,
              private _tagFiltersService: TagsFiltersService,
              private _sharedWorldmapService: SharedWorldmapService,
              private _worldmapFiltersService: WorldmapFiltersService) { }

  ngOnInit() {
    this._filterService.reset();
    this._initializeReport();
    this._isOwner = (this._authService.userId === this._innovation.owner.id) || this._authService.adminLevel > 2;
  }


  /***
   * This function is calling all the initial functions.
   */
  private _initializeReport() {
    this._initializeVariable();
    this._getAnswers();
    this._getCampaign();
    this.resetMap();
    this.presets();
  }


  public getMessage(): string {
    switch (this._innovation.status) {

      case 'EDITING':
        return this._innovation.reviewing ? 'MARKET_REPORT.MESSAGE.REVIEWING' : 'MARKET_REPORT.MESSAGE.EDITING';

      case 'EVALUATING':
        return 'MARKET_REPORT.MESSAGE.EVALUATING';

      case 'SUBMITTED':
        return 'MARKET_REPORT.MESSAGE.SUBMITTED';

      default:
        return '';

    }
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
    this._previewMode = !!this._innovation.previewMode;


    /***
     * we are checking do we have any template.
     * @type {number | undefined}
     */
    this._numberOfSections = this._innovation.executiveReport ? this._innovation.executiveReport.totalSections || 0 : 0;

    /***
     * assinging the value of the executive template.
     * @type {Executive}
     */
    this._executiveTemplates = executiveTemplate;

  }


  private _updateAnswersToShow(): void {
    this._filteredAnswers = this._filterService.filter(this._answers);
    this._answersOrigins = this._sharedWorldmapService.getCountriesRepartition(
      this._filteredAnswers.map(x => x.country.flag || x.professional.country)
    );
  }


  /***
   * This function is to fetch the answers from the server.
   */
  private _getAnswers() {
    this._answerService.getInnovationValidAnswers(this._innovation._id).subscribe((response) => {
      this._answers = response.answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });

      this._filteredAnswers = this._answers;

      this._updateAnswersToShow();

      this._filterService.filtersUpdate.subscribe(() => this._updateAnswersToShow());

      this._companies = response.answers.map((answer: any) => answer.company || {
        name: answer.professional.company
      }).filter(function(item: any, pos: any, self: any) {
        return self.findIndex((subitem: Clearbit) => subitem.name === item.name) === pos;
      });

      this._countries = response.answers.reduce((acc, answer) => {
        if (acc.indexOf(answer.country.flag) === -1) {
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
      }, {});
      this._tagFiltersService.tagsList = Object.keys(tagsDict).map((k) => tagsDict[k]);

      /*
       * compute tags lists for each questions of type textarea
       */
      this._questions.forEach((question) => {
        const tags = ResponseService.getTagsList(response.answers, question);
        const identifier = (question.controlType === 'textarea') ? question.identifier : question.identifier + 'Comment';
        this._tagFiltersService.setAnswerTags(identifier, tags);
      });

    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }


  /***
   * This function is to fetch the campaign from the server.
   */
  private _getCampaign() {
    this._innovationService.campaigns(this._innovation._id).subscribe((results) => {
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
     this._questions = ResponseService.getPresets(this._innovation);
   }
  }


  /***
   * This function is to update the projects.
   * @param {Event} event
   */
  public update(event: Event) {
    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
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
   * This function is called when we click on the radio button, and assign the
   * clicked value to the numberOfSection.
   * @param {Event} event
   * @param {number} value
   */
  public assignSectionValue(event: Event, value: number) {
    event.preventDefault();
    this._numberOfSections = value;
  }


  /***
   * This function is called when you click on the valid template button.
   * We assign the number of section value to the this.project.executiveReport.totalSections
   * and call the update function to save it in database.
   * @param {Event} event
   */
  public generateExecutiveTemplate(event: Event) {
    event.preventDefault();
    this._innovation.executiveReport.totalSections = this._numberOfSections;
    this.update(event);
  }


  /***
   * This function is to return the src of the UMI intro image.
   * @returns {string}
   */
  public get introSrc(): string {

    if (this.userLang === 'en') {
      return 'https://res.cloudinary.com/umi/image/upload/v1550482760/app/default-images/intro/UMI-en.png';
    }

    if (this.userLang === 'fr') {
      return 'https://res.cloudinary.com/umi/image/upload/v1550482760/app/default-images/intro/UMI-fr.png';
    }

  }


  /***
   * This function saves the comment of the operator.
   * @param event
   * @param {string} ob
   */
  public saveOperatorComment(event: any, ob: string) {
    const objToSave = {};

    objToSave[ob] = {
      conclusion: event['content']
    };

    this._innovationService.updateMarketReport(this._innovation._id, objToSave).subscribe(() => {
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

  }


  /***
   * This function is to filter by the countries.
   * @param {{continents: {[continent: string]: boolean}, allChecked: boolean}} event
   */
  filterByContinents(event: {continents: {[continent: string]: boolean}, allChecked: boolean}): void {
    this._worldmapFiltersService.selectContinents(event);
  }


  filterPro(answer: Answer, event: Event) {
    event.preventDefault();
    let proFiltered = {};
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
      animate_state: this._sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
      title: 'Insight',
      size: '726px'
    };

  }


  public get mainDomain(): boolean {
    return environment.domain === 'umi';
  }

  public get userLang(): string {
    return this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  public get domainName(): string {
    return environment.domain;
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

  get campaignStats() {
    return this._campaignsStats;
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

  get numberOfSections(): number {
    return this._numberOfSections;
  }

  get executiveTemplates(): Array<Executive> {
    return this._executiveTemplates;
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

  get toggleProfessional(): boolean {
    return this._toggleProfessional;
  }

  set toggleProfessional(value: boolean) {
    this._toggleProfessional = value;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
