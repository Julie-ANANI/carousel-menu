import { Component, OnInit, Input } from '@angular/core';
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
import { Executive, executiveTemplate } from './models/template';
import { ResponseService } from './services/response.service';
import { TagsFiltersService } from './services/tags-filter.service';
import { WorldmapFiltersService } from './services/worldmap-filter.service';
import { InnovationFrontService } from '../../../../services/innovation/innovation-front.service';
import {SharedWorldmapService} from '../shared-worldmap/services/shared-worldmap.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss']
})

export class SharedMarketReportComponent implements OnInit {

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

  private _numberOfSections: number;

  private _executiveTemplates: Array<Executive>;

  private _modalAnswer: Answer = null;

  private _leftSidebarTemplateValue: SidebarInterface = {
    animate_state: 'active',
    type: 'market-report'
  };

  private _sidebarTemplateValue: SidebarInterface = {};

  private _companies: Array<Clearbit>;

  private _toggleProfessional: boolean;

  private _anonymousAnswers: boolean = false;

  constructor(private _translateService: TranslateService,
              private _answerService: AnswerService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _innovationService: InnovationService,
              private _authService: AuthService,
              private _filterService: FilterService,
              private _tagFiltersService: TagsFiltersService,
              private _sharedWorldMapService: SharedWorldmapService,
              private _worldmapFiltersService: WorldmapFiltersService) { }

  ngOnInit() {
    this._filterService.reset();
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


  /**
   * Minor modif
   */
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
    this._previewMode = this._innovation.previewMode ? this._innovation.previewMode : false;


    /***
     * we are checking do we have any template.
     * @type {number | undefined}
     */
    this._numberOfSections = this._innovation.executiveReport ? this._innovation.executiveReport.totalSections || 0 : 0;

    /***
     * assigning the value of the executive template.
     * @type {Executive}
     */
    this._executiveTemplates = executiveTemplate;

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
      this._answers = response.answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });

      if( this._anonymousAnswers ) {
        this._answers = <Array<Answer>>this._answers.map( answer => {
          const _answer = {};
          Object.keys(answer).forEach(key => {
            switch(key) {
              case('company'):
                _answer[key] = {
                  'name': ''
                };
                break;
              case('professional'):
                if (answer[key]['company']) {
                  _answer[key]['company'] = {
                    'name': ''
                  };
                }
                break;
              default:
                _answer[key] = answer[key];
            }
          });
          return _answer;
        });
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
        const tags = ResponseService.getTagsList(response.answers, question);
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
     this._questions = ResponseService.getPresets(this._innovation);
   }
  }


  /***
   * This function is to update the projects.
   * @param {Event} event
   */
  public updateExecutiveReport(event: Event) {
    event.preventDefault();
    this._innovationService.save(this._innovation._id, {executiveReport: this._innovation.executiveReport}).subscribe(() => {
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
    this.updateExecutiveReport(event);
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
  public saveOperatorComment(event: {content: string}, ob: string) {
    const innoChanges = { marketReport: { [ob]: { conclusion: event.content } } };
    this._innovationService.save(this._innovation._id, innoChanges).subscribe(() => {
      // do nothing
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

  get answersByCountries(): boolean {
    return this._answersByCountries;
  }

  get toggleProfessional(): boolean {
    return this._toggleProfessional;
  }

  set toggleProfessional(value: boolean) {
    this._toggleProfessional = value;
  }

}
