import {Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, PLATFORM_ID} from '@angular/core';
import {Innovation} from '../../../../models/innovation';
import {SharedFilter} from '../../../shared/components/shared-market-report/models/shared-filter';
import {InnovationService} from '../../../../services/innovation/innovation.service';
import {TranslateNotificationsService} from '../../../../services/translate-notifications/translate-notifications.service';
import {FilterService} from '../../../shared/components/shared-market-report/services/filters.service';
import {Answer} from '../../../../models/answer';
import {first, takeUntil} from 'rxjs/operators';
import {Question} from '../../../../models/question';
import {WorldmapService} from '../../../../services/worldmap/worldmap.service';
import {Tag} from '../../../../models/tag';
import {TagsFiltersService} from '../../../shared/components/shared-market-report/services/tags-filter.service';
import {WorldmapFiltersService} from '../../../shared/components/shared-market-report/services/worldmap-filter.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../services/error/error-front.service';
import {Subject} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';
import {AnswerFrontService} from '../../../../services/answer/answer-front.service';
import {isPlatformBrowser} from '@angular/common';
import {Professional} from '../../../../models/professional';
import {UserFrontService} from '../../../../services/user/user-front.service';
import {picto, Picto} from '../../../../models/static-data/picto';
import {MissionQuestionService} from '../../../../services/mission/mission-question.service';

type Template = 'MARKET_REPORT' | 'FOLLOW_UP';

@Component({
  selector: 'app-sidebar-filter-answers',
  templateUrl: './sidebar-filter-answer.component.html',
  styleUrls: ['./sidebar-filter-answers.component.scss']
})

export class SidebarFilterAnswersComponent implements OnChanges, OnDestroy {

  @Input() templateType: Template = 'MARKET_REPORT';

  @Input() reportingLang = this._translateService.currentLang;

  @Input() isViewsEditable = false;

  @Input() isOwner = false;

  @Input() isAdminSide = false;

  @Input() questions: Array<any> = [];

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._answersCountries = value.map(answer => (answer.country && answer.country.flag)
      || (answer.professional && answer.professional.country));
  }

  @Input() set innovation(value: Innovation) {
    if (value && value._id) {
      this._innovation = value;
      if (this._innovation.marketReport) {
        this._isKeyLearning = !!this._innovation?.marketReport?.keyLearning?.conclusion;
        this._isFinalConclusion = this._innovation.marketReport.finalConclusion
          && this._innovation.marketReport.finalConclusion.conclusion
          && this._innovation.marketReport.finalConclusion.conclusion !== '';
      }
      this._loadSharedFiltersList();
    }
  }

  /***
   * this is to emit the event that will close the
   * sidebar.
   */
  @Output() closeSidebar: EventEmitter<void> = new EventEmitter<void>();

  @Output() selectedAnswers: EventEmitter<Array<Answer>> = new EventEmitter<Array<Answer>>();

  private _isModalEnd = false;

  private _isModalPreview = false;

  private _filterNumber = 0;

  private _innovation: Innovation = <Innovation>{};

  private _answers: Array<Answer> = [];

  private _answersCountries: string[] = [];

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _filterName = '';

  private _activatedCustomFilters: Array<string> = [];

  private _displayedQuestions: Array<Question> = [];

  private _showSection: {[questionId: string]: boolean} = {
    map: true,
    professionals: true
  };

  private _seeMore: {[questionId: string]: boolean} = {
    professionals: false
  };

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _isKeyLearning = false;

  private _isFinalConclusion = true;

  private _professionalsTags: Array<Tag> = [];

  private _picto: Picto = picto;

  private _answersSelected: Array<Answer> = [];

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _worldmapFilterService: WorldmapFiltersService,
              private _tagService: TagsFiltersService,
              private _translateService: TranslateService,
              private _filterService: FilterService) { }

  ngOnChanges(): void {
    if (this._answers.length) {
      this._initData(this._answers);
      this._professionalsTags = AnswerFrontService.tagsOccurrence(this.answers);
      this._filterService.filtersUpdate.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
        this._initData(this._filterService.filter(this._answers));
      });
    }
    this._initQuestions();
  }

  private _initData(answers: Array<Answer>) {
    if (this.templateType === 'FOLLOW_UP') {
      answers = answers.filter((_answer) =>  !(_answer.followUp && _answer.followUp.date));
    }
    this._answersSelected = answers;
    this._filterNumber = answers.length;
  }

  public questionTitle(question: any): string {
    return MissionQuestionService.label(question, 'title', this.reportingLang);
  }

  public optionLabel(option: any): string {
    return MissionQuestionService.label(option, 'label', this.reportingLang);
  }

  private _loadSharedFiltersList() {
    if (isPlatformBrowser(this._platformId)) {
      this._innovationService.getFiltersList(this._innovation._id).pipe(first()).subscribe((results) => {
        if (Array.isArray(results)) {
          this._sharedFiltersList = results;
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  private _initQuestions() {
    this._displayedQuestions = [];
    this.questions.forEach((question: Question) => {
      if (!this._showSection[question.identifier]) {
        this._showSection[question.identifier] = true;
      }
      if (!this._seeMore[question.identifier]) {
        this._seeMore[question.identifier] = false;
      }
      if (this.templateType === 'MARKET_REPORT' || question.controlType === 'checkbox' ||
        question.controlType === 'radio' || this.answersTagsLists[question.identifier] &&
        this.answersTagsLists[question.identifier].length) {
        this._displayedQuestions.push(question);
      }
    });
  }

  public resetFilters(value: boolean) {
    if (value) {
      this._activatedCustomFilters = [];
      this._tagService.reselectEveryTags();
      this._worldmapFilterService.reset();
      this._filterService.reset();
    } else {
      this.filterEverything(false, this.continentsList, 'CONTINENT');
      this.filterEverything(false, this._professionalsTags, 'TAG');
      this.questions.forEach(question => {
        this.filterEverything(false, [question], question.controlType);
      });
    }
  }

  public onSelectedContacts(event: Event) {
    event.preventDefault();
    this.selectedAnswers.emit(this._answersSelected);
  }

  public openModalPreview(event: Event) {
    event.preventDefault();
    this._isModalPreview = true;
  }

  public onStatusUpdated(event: boolean) {
    if (event) {
      this._innovation.status = 'DONE';
    }
  }

  public openModalEnd(event: Event) {
    event.preventDefault();
    this._isModalEnd = true;
  }

  public deleteProfessionalFilter(event: Event, id: string) {
    event.preventDefault();
    const filterValue = this._filterService.filters['professionals'].value;
    delete filterValue[id];
    const removeFilter = Object.keys(filterValue).length === 0;
    if (removeFilter) {
      this._filterService.deleteFilter('professionals');
    } else {
      this._filterService.addFilter({
        status: 'PROFESSIONALS',
        questionId: 'professionals',
        value: filterValue
      });
    }
  }

  public registerNewFilter() {
    const _find = this._sharedFiltersList.find((filter) =>
      filter.name.toLowerCase() === this._filterName.toLowerCase()
    );
    if (!_find) {
      const _data = {
        name: this._filterName,
        answers: this._filterService.filter(this.answers).map((answer) => answer._id)
      };
      this._innovationService.saveFilter(this._innovation._id, _data).pipe(first()).subscribe((res) => {
        this._sharedFiltersList.push(res);
        this._filterName = '';
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR',
        'SIDEBAR_MARKET_REPORT.ERRORS.VIEW_ALREADY_EXIST');
    }
  }

  public updateFilter(filter: any, oldFilterName: string) {
    const index = this._sharedFiltersList.findIndex((f) => f._id === filter._id);
    if (index) {
      this._innovationService.updateFilter(this._innovation._id, filter, oldFilterName)
          .pipe(first()).subscribe((res) => {
        this._sharedFiltersList[index] = res;
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    }
  }

  public checkOption(event: Event, question: Question) {
    event.preventDefault();
    const checked = (event.target as HTMLInputElement).checked;
    let filterValue: any;
    if (this._filterService.filters[question.identifier]) {
      filterValue = this._filterService.filters[question.identifier].value;
    } else {
      filterValue = question.options.reduce((acc, opt) => { acc[opt.identifier] = true; return acc; }, {} as any);
    }
    filterValue[(event.target as HTMLInputElement).name] = checked;
    const removeFilter = checked && Object.keys(filterValue).every((k) => filterValue[k] === true);
    if (removeFilter) {
      this._filterService.deleteFilter(question.identifier);
    } else {
      this._filterService.addFilter({
        status: <'CHECKBOX'|'RADIO'> question.controlType.toUpperCase(),
        questionId: question.identifier,
        value: filterValue
      });
    }
  }

  public onConfirmVisibility(event: Event) {
    event.preventDefault();
    if (this.isAdminSide) {
      this._innovation.previewMode = !this._innovation.previewMode;
      this._innovationService.save(this._innovation._id, {previewMode: this._innovation.previewMode}).pipe(first())
        .subscribe((response: Innovation) => {
          this._isModalPreview = false;
          if (response.previewMode) {
            this._translateNotificationsService.success('Success',
              'The partial synthesis is now visible to the client.');
          } else {
            this._translateNotificationsService.success('Success',
              'The partial synthesis is not visible to the client.');
          }
        }, (err: HttpErrorResponse) => {
          this._innovation.previewMode = !this._innovation.previewMode;
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          console.error(err);
        });
    }
  }

  public deleteCustomFilter(name: string) {
    this._innovationService.deleteFilter(this._innovation._id, encodeURIComponent(name))
      .pipe(first()).subscribe((result) => {
      if (result['ok'] === 1) {
        this._sharedFiltersList = this._sharedFiltersList.filter((filter) => filter.name !== name);
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
      console.error(err);
    });
  }

  public loadFilter(name: string) {
    const _find = this._activatedCustomFilters.find((filter) => filter.toLowerCase() === name.toLowerCase());
    if (!_find) {
      this._innovationService.getFilter(this._innovation._id, encodeURIComponent(name))
        .pipe(first()).subscribe((result) => {
          if (result) {
            this._filterService.addFilter({
              status: 'CUSTOM',
              questionId: name,
              value: result.answers
            });
          this._activatedCustomFilters.push(name);
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        console.error(err);
      });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR',
        'SIDEBAR_MARKET_REPORT.ERRORS.VIEW_ALREADY_ACTIVATED');
    }
  }

  public unloadFilter(event: Event, name: string) {
    event.preventDefault();
    this._activatedCustomFilters = this._activatedCustomFilters.filter((f) => name !== f);
    this._filterService.deleteFilter(name);
  }

  public checkContinent(event: Event) {
    event.preventDefault();
    this._worldmapFilterService.selectContinent((event.target as HTMLInputElement).name,
      (event.target as HTMLInputElement).checked);
  }

  public checkCountry(event: Event) {
    event.preventDefault();
    this._worldmapFilterService.selectCountry((event.target as HTMLInputElement).name,
      (event.target as HTMLInputElement).checked, this.answersCountries);
  }

  public checkTag(event: Event, tagId: string) {
    event.preventDefault();
    this._tagService.checkTag(tagId, (event.target as HTMLInputElement).checked);
  }

  public checkAnswerTag(event: Event, questionIdentifier: string) {
    event.preventDefault();
    this._tagService.checkAnswerTag(questionIdentifier, (event.target as HTMLInputElement).name,
      (event.target as HTMLInputElement).checked);
  }

  public filterEverything(isChecked: boolean, filterArray: Array<any>, typeFilter: string) {
    let question: Question;
    switch (typeFilter) {
      case 'CONTINENT':
        filterArray.forEach(continent => {
          this._worldmapFilterService.selectContinent(continent, isChecked);
        });
        break;
      case 'TAG':
        filterArray.forEach(tag => {
          this._tagService.checkTag(tag._id, isChecked);
        });
        break;
      case 'textarea':
        question = filterArray[0];
        const tagArray: Array<Tag> = this._tagService.answersTagsLists[question.identifier];
        tagArray.forEach(t => {
          this._tagService.checkAnswerTag(question.identifier, t._id, isChecked);
        });
        break;
      case 'likert-scale':
      case 'radio':
      case 'checkbox':
        question = filterArray[0];
        if (isChecked) {
          this._filterService.deleteFilter(question.identifier);
        } else {
          const filterValue = question.options.reduce((acc, opt) => { acc[opt.identifier] = isChecked; return acc; }, {} as any );
          this._filterService.addFilter({
            status: <'CHECKBOX'|'RADIO'> question.controlType.toUpperCase(),
            questionId: question.identifier,
            value: filterValue
          });
        }
        break;
    }
  }

  public professionalName(value: Professional): string {
    return UserFrontService.fullName(value);
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get sharedFiltersList(): Array<SharedFilter> {
    return this._sharedFiltersList;
  }

  get filterName(): string {
    return this._filterName;
  }

  get filterNumber(): number {
    return this._filterNumber;
  }

  set filterName(value: string) {
    this._filterName = value;
  }

  get activatedCustomFilters() {
    return this._activatedCustomFilters;
  }

  get displayedQuestions(): Array<Question> {
    return this._displayedQuestions;
  }

  get continentsList(): Array<string> {
    return WorldmapService.continentsList;
  }

  get answersTagsLists(): {[questionId: string]: Array<Tag>} {
    return this._tagService.answersTagsLists;
  }

  get filters() {
    return this._filterService.filters;
  }

  get filteredContinents() {
    return this._filterService.filters['worldmap'] ? this._filterService.filters['worldmap'].value.continents : null;
  }

  get filteredCountries() {
    return this._filterService.filters['worldmap'] ? this._filterService.filters['worldmap'].value.countries : null;
  }

  get selectedTags(): {[t: string]: boolean} {
    return this._tagService.selectedTags;
  }

  get filtersCount() {
    return Object.keys(this._filterService.filters).length;
  }

  get isModalEnd(): boolean {
    return this._isModalEnd;
  }

  set isModalEnd(value: boolean) {
    this._isModalEnd = value;
  }

  get isModalPreview(): boolean {
    return this._isModalPreview;
  }

  set isModalPreview(value: boolean) {
    this._isModalPreview = value;
  }

  get selectedAnswersTags(): {[questionId: string]: {[t: string]: boolean}} {
    return this._tagService.selectedAnswersTags;
  }

  get showSection(): { [p: string]: boolean } {
    return this._showSection;
  }

  get seeMore(): { [p: string]: boolean } {
    return this._seeMore;
  }

  get isKeyLearning(): boolean {
    return this._isKeyLearning;
  }

  get isFinalConclusion(): boolean {
    return this._isFinalConclusion;
  }

  get professionalsTags(): Array<Tag> {
    return this._professionalsTags;
  }

  get picto(): Picto {
    return this._picto;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get answersCountries(): string[] {
    return this._answersCountries;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
