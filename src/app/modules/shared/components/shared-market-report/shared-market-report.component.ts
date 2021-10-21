import {
  Component,
  Inject,
  Input,
  OnDestroy,
  OnChanges,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  SimpleChange,
} from '@angular/core';
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
import { WorldmapService } from '../../../../services/worldmap/worldmap.service';
import { AnswerFrontService } from '../../../../services/answer/answer-front.service';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { RolesFrontService } from '../../../../services/roles/roles-front.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { emptyHtmlRegex } from '../../../../utils/regex';
import { SocketService } from '../../../../services/socket/socket.service';
import { Professional } from '../../../../models/professional';
import {MissionFrontService} from '../../../../services/mission/mission-front.service';
import {Mission} from '../../../../models/mission';
import {MissionQuestionService} from '../../../../services/mission/mission-question.service';

@Component({
  selector: 'app-shared-market-report',
  templateUrl: './shared-market-report.component.html',
  styleUrls: ['./shared-market-report.component.scss'],
})
export class SharedMarketReportComponent implements OnInit, OnDestroy, OnChanges {
  @Input() accessPath: Array<string> = [];

  @Input() adminSide = false;

  @Input() reportShared = false;

  @Input() showAnonymousAnswers = false;

  @Input() set project(value: Innovation) {
    if (value && value._id) {
      this._innovation = value;
      this._innovation.marketReport = this._innovation.marketReport || {};
      this._isOwner =
        this._authService.userId ===
          (this._innovation.owner && this._innovation.owner.id) ||
        this._authService.adminLevel > 3;
    }
  }

  private _innovation: Innovation = <Innovation>{};

  private _isOwner = false;

  private _previewMode = false;

  private _answers: Array<Answer> = [];

  private _filteredAnswers: Array<Answer> = [];

  private _answersOrigins: {
    [continent: string]: {
      count: number;
      countries: { [country: string]: { count: number; names: any } };
    };
  } = {};

  private _countries: Array<string> = [];

  private _answersByCountries: any = {};

  private _questions: Array<any> = [];

  private _toggleAnswers = false;

  private _modalAnswer: Answer = <Answer>{};

  private _leftSidebarTemplateValue: SidebarInterface = {
    animate_state: 'active',
    type: 'MARKET_REPORT',
  };

  private _sidebarTemplateValue: SidebarInterface = <SidebarInterface>{};

  private _companies: Array<Clearbit> = [];

  private _toggleProfessional = false;

  private _anonymousAnswers = false;

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _toBeSaved = false;

  private _isMainDomain = environment.domain === 'umi';

  private _reportingLang = '';

  public areAnswersLoading = true;

  public displayFilters = false;

  private _toSaveTemplate = false;

  constructor(
    @Inject(PLATFORM_ID) protected _platformId: Object,
    private _translateService: TranslateService,
    private _answerService: AnswerService,
    private _translateNotificationsService: TranslateNotificationsService,
    private _innovationService: InnovationService,
    private _authService: AuthService,
    private _rolesFrontService: RolesFrontService,
    private _missionQuestionService: MissionQuestionService,
    private _innovationFrontService: InnovationFrontService,
    private _filterService: FilterService,
    private _tagFiltersService: TagsFiltersService,
    private _sharedWorldMapService: WorldmapService,
    private _socketService: SocketService,
    private _worldmapFiltersService: WorldmapFiltersService
  ) {}

  ngOnInit() {
    this.reportingLang =
      this._innovation.settings.reportingLang ||
      this._translateService.currentLang;
    this._filterService.reset();

    this._innovationFrontService
      .getNotifyChanges()
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe((value) => {
        this._toBeSaved = !!(value && value.state);
      });

    this._missionQuestionService.missionTemplate().pipe(takeUntil(this._ngUnsubscribe)).subscribe((value) => {
      if (value && value.entry && value.entry.length) {
        (<Mission>this._innovation.mission).template = value;
        this._toSaveTemplate = true;
        this._toBeSaved = true;
      }
    });

    this._socketService
      .getTagsUpdatedForPro(this.innovation._id)
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(
        (data: any) => {
          this._realTimeUpdateTags(JSON.parse(data));
        },
        (error) => {
          console.error(error);
        }
      );
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentItem: SimpleChange = changes.project;
    if (!currentItem.previousValue) {
      this._initializeReport();
    } else {
      this._questions = InnovationFrontService.questionsList(this._innovation);
    }
  }

  public canAccess(path: Array<string>) {
    return this._rolesFrontService.hasAccessAdminSide(
      this.accessPath.concat(path)
    );
  }

  /***
   * This function is calling all the initial functions.
   */
  private _initializeReport() {
    this._anonymousAnswers = !!(
      this._innovation._metadata &&
      this._innovation._metadata.campaign &&
      this._innovation._metadata.campaign.anonymous_answers
    );

    this._getAnswers();

    // this is to check, if the admin make the synthesis available before the status is Done.
    this._previewMode = this._innovation.previewMode
      ? this._innovation.previewMode
      : false;

    this._worldmapFiltersService.reset();
    this._questions = InnovationFrontService.questionsList(this._innovation);
  }

  _realTimeUpdateTags(data: any) {
    for (let i = 0; i < this._filteredAnswers.length; i++) {
      if (this._filteredAnswers[i]._id === data.id) {
        data.professional = this._filteredAnswers[i].professional;
        this._filteredAnswers[i] = data;
      }
    }
  }

  /***
   * This function is to fetch the answers from the server.
   */
  private _getAnswers() {
    if (isPlatformBrowser(this._platformId)) {
      this._answerService
        .getInnovationValidAnswers(this._innovation._id, this._anonymousAnswers)
        .pipe(first())
        .subscribe(
          (response) => {
            this._processAnswers(response.answers);
            this._processFilterAnswers();
            this._processAnswersCompanies(response.answers);
            this._processAnswersCountries(response.answers);
            this._processAnswersTags(response.answers);
            this._processAnswersQuestion(response.answers);
            this.areAnswersLoading = false;
            setTimeout(() => (this.displayFilters = true), 500);
          },
          (err: HttpErrorResponse) => {
            this.areAnswersLoading = false;
            this.displayFilters = true;
            this._translateNotificationsService.error(
              'ERROR.ERROR',
              ErrorFrontService.getErrorMessage(err.status)
            );
            console.error(err);
          }
        );
    }
  }

  private _processAnswers(answers: any) {
    this._answers = AnswerFrontService.qualitySort(answers);

    if (this._anonymousAnswers) {
      this._answers = AnswerFrontService.anonymous(this._answers);
    }
  }

  private _processFilterAnswers() {
    this._filteredAnswers = this._answers;
    this._updateAnswersToShow();

    this._filterService.filtersUpdate
      .pipe(takeUntil(this._ngUnsubscribe))
      .subscribe(() => this._updateAnswersToShow());
  }

  private _processAnswersCompanies(answers: any) {
    this._companies = answers
      .map(
        (answer: any) =>
          answer.company || {
            name: answer.professional.company,
          }
      )
      .filter(function (item: any, pos: any, self: any) {
        return (
          self.findIndex((subitem: Clearbit) => subitem.name === item.name) ===
          pos
        );
      });
  }

  private _processAnswersCountries(answers: any) {
    this._countries = answers.reduce((acc: any[], answer: any) => {
      if (
        !!answer.country &&
        !!answer.country.flag &&
        acc.indexOf(answer.country.flag) === -1
      ) {
        acc.push(answer.country.flag);
      }
      return acc;
    }, []);
  }

  /*
   * compute tag list globally
   */
  private _processAnswersTags(answers: any) {
    const tagsDict = answers.reduce(function (acc: any, answer: any) {
      answer.tags.forEach((tag: any) => {
        if (!acc[tag._id]) {
          acc[tag._id] = tag;
        }
      });
      return acc;
    }, {} as { [id: string]: Tag });

    this._tagFiltersService.tagsList = Object.keys(tagsDict).map(
      (k) => tagsDict[k]
    );
  }

  /*
   * compute tags lists for each questions of type textarea
   */
  private _processAnswersQuestion(answers: any) {
    this._questions.forEach((question) => {
      const tags = ResponseService.tagsList(answers, question);
      const identifier =
        question.controlType === 'textarea'
          ? question.identifier
          : question.identifier + 'Comment';
      this._tagFiltersService.setAnswerTags(identifier, tags);
    });
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
    const countriesList = this._filteredAnswers.map(function (
      answer: Answer
    ): string {
      let flag = '';
      if (!!answer.country) {
        if (typeof answer.country === 'string') {
          flag = answer.country;
        } else if (answer.country.flag) {
          flag = answer.country.flag;
        }
      }
      if (!flag && !!answer.professional && !!answer.professional.country) {
        flag = answer.professional.country;
      }
      if (flag) {
          addAnswer(flag);
      }
      return flag;
    });

    this._sharedWorldMapService
      .getCountriesRepartitionByContinent(countriesList)
      .then((r) => (this._answersOrigins = r));
  }

  /***
   * This function saves the comment of the operator.
   * @param event
   * @param {string} ob
   */
  public saveOperatorComment(event: { content: string }, ob: string) {
    this._innovation.marketReport[ob] = { conclusion: event.content };
    this._innovationFrontService.setNotifyChanges({
      key: 'marketReport',
      state: true,
    });
  }

  /***
   * This function saves changes of any question of the operator (piechart colors, title, subtitle)
   *
   * updated on 17th June, 2021
   * @param question
   */
  public saveQuestion(question: Question) {

    // If section title is from default market report sections (key learnings, origin of responses, conclusion)
    switch (question.identifier) {
      case 'professionals':
        if (!this._innovation.marketReport.professionals) {
          this._innovation.marketReport.professionals = {
            title: {},
            subtitle: {}
          };
        }
        this._innovation.marketReport.professionals.title = question.title;
        this._innovation.marketReport.professionals.subtitle = question.subtitle;
        break;
      case 'keyLearning':
        if (!this._innovation.marketReport.keyLearning) {
          this._innovation.marketReport.keyLearning = {
            title: {},
            subtitle: {}
          };
        }
        this._innovation.marketReport.keyLearning.title = question.title;
        this._innovation.marketReport.keyLearning.subtitle = question.subtitle;
        break;
      case 'finalConclusion':
        if (!this._innovation.marketReport.finalConclusion) {
          this._innovation.marketReport.finalConclusion = {
            title: {},
            subtitle: {}
          };
        }
        this._innovation.marketReport.finalConclusion.title = question.title;
        this._innovation.marketReport.finalConclusion.subtitle = question.subtitle;
        break;
    }

    this._innovationFrontService.setNotifyChanges({
      key: 'marketReport',
      state: true,
    });

    // If section title is from question
    if (!MissionFrontService.hasMissionTemplate(<Mission>this._innovation.mission)) {
      this._innovation.preset.sections.forEach((section: any) => {
        const indexOfQuestion = section.questions.indexOf(
          (que: Question) => que.identifier === question.identifier
        );
        if (indexOfQuestion >= 0) {
          section.questions[indexOfQuestion] = question;
        }
      });

      this._innovationFrontService.setNotifyChanges({
        key: 'preset',
        state: true,
      });

    }
  }

  public saveInnovation(event: Event) {
    event.preventDefault();
    const objToSave = {
      marketReport: this._innovation.marketReport,
      settings: this._innovation.settings
    };

    // Modified only admin side
    if (this._toSaveTemplate && MissionFrontService.hasMissionTemplate(<Mission>this._innovation.mission)) {
      objToSave['missionTemplate'] = (<Mission>this._innovation.mission).template;
    } else {
      objToSave['preset'] = this._innovation.preset;
    }

    this._innovationService.save(this._innovation._id, objToSave).pipe(first()).subscribe(() => {
      this._toBeSaved = false;
      this._toSaveTemplate = false;
      this._translateNotificationsService.success('Success', 'The synthesis has been saved.');
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
  }

  public displayFixedQuestion(question: any) {
    switch (question.identifier) {
      case 'professionals':
        if (this._innovation.marketReport.professionals) {
          question.title = this._innovation.marketReport.professionals.title || question.title;
          question.subtitle = this._innovation.marketReport.professionals.subtitle || question.subtitle;
        }
        break;
      case 'keyLearning':
        if (this._innovation.marketReport.keyLearning) {
          question.title = this._innovation.marketReport.keyLearning.title || question.title;
          question.subtitle = this._innovation.marketReport.keyLearning.subtitle || question.subtitle;
        }
        break;
      case 'finalConclusion':
        if (this._innovation.marketReport.finalConclusion) {
          question.title = this._innovation.marketReport.finalConclusion.title || question.title;
          question.subtitle = this._innovation.marketReport.finalConclusion.subtitle || question.subtitle;
        }
        break;
    }

    return question;
  }

  public setNewSelectedLang(value: string) {
    this._reportingLang = value;
    this.innovation.settings.reportingLang = this.reportingLang;
    this._innovationFrontService.setNotifyChanges({
      key: 'settings',
      state: true,
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
      questionId: 'professionals',
    });
  }

  public seeAnswer(answer: Answer): void {
    this._modalAnswer = answer;
    this._sidebarTemplateValue = {
      animate_state: 'active',
      title: 'Insight',
      size: '726px',
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

  get filters(): { [questionId: string]: Filter } {
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

  get questions(): Array<any> {
    return this._questions;
  }

  trackQuestions(index: number, question: Question) {
    return question.identifier;
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

  get answersOrigins(): {
    [continent: string]: {
      count: number;
      countries: { [country: string]: { count: number; names: any } };
    };
  } {
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

  get reportingLang(): string {
    return this._reportingLang;
  }

  set reportingLang(value: string) {
    this._reportingLang = value;
  }

  hideQuestionAnswers(question: Question) {
    return (
      this.showAnonymousAnswers &&
      (question.sensitiveAnswerData ||
        question.identifier.indexOf('contact') !== -1)
    );
  }

  showSection(sectionText: string) {
    return (
      ((sectionText && !emptyHtmlRegex.test(sectionText)) || this.adminSide) &&
      !this.areAnswersLoading
    );
  }

  updateNewPro(value: any) {
    const proToUpdate = this._answers.find((item) => item._id === value._id);
    proToUpdate.professional = !proToUpdate.professional
      ? <Professional>{}
      : proToUpdate.professional;
    proToUpdate.professional.firstName = value.newPro.firstName;
    proToUpdate.professional.lastName = value.newPro.lastName;
    proToUpdate.professional.email = value.newPro.email;
    if (value.newPro.jobTitle) {
      proToUpdate.professional.jobTitle = value.newPro.jobTitle;
      proToUpdate.job = value.newPro.jobTitle;
    }
    if (value.newPro.company) {
      proToUpdate.company.name = value.newPro.company;
    }
    if (value.newPro.country) {
      proToUpdate.country = { flag: value.newPro.country.flag };
    }
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
