import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output } from '@angular/core';
import { Innovation } from '../../../../models/innovation';
import { SharedFilter } from '../../../shared/components/shared-market-report/models/shared-filter';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { FilterService } from '../../../shared/components/shared-market-report/services/filters.service';
import { Answer } from '../../../../models/answer';
import { first, takeUntil } from 'rxjs/operators';
import { Question } from '../../../../models/question';
import { SharedWorldmapService } from "../../../shared/components/shared-worldmap/services/shared-worldmap.service";
import { Tag } from "../../../../models/tag";
import { TagsFiltersService } from "../../../shared/components/shared-market-report/services/tags-filter.service";
import { WorldmapFiltersService } from "../../../shared/components/shared-market-report/services/worldmap-filter.service";
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../services/error/error-front.service';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-filter-answers',
  templateUrl: './sidebar-filter-answer.component.html',
  styleUrls: ['./sidebar-filter-answers.component.scss']
})

export class SidebarFilterAnswersComponent implements OnChanges, OnDestroy {

  @Input() set innovation(value: Innovation) {
    if (value._id) {
      this._innovation = value;
      if (this._innovation.marketReport) {
        this._isKeyLearning = this._innovation.marketReport.keyLearning
          && this._innovation.marketReport.keyLearning.conclusion !== '';
        this._isFinalConclusion = this._innovation.marketReport.finalConclusion
          && this._innovation.marketReport.finalConclusion.conclusion
          && this._innovation.marketReport.finalConclusion.conclusion !== '';
      }
      this._loadSharedFiltersList();
    }
  }

  @Input() answers: Array<Answer> = [];

  @Input() isAdmin = false;

  @Input() isOwner = false;

  @Input() isAdminSide = false;

  @Input() set templateType(value: string) {
    this._templateType = value;
  }

  @Input() set questions(value: Array<Question>) {
    this._questions = value;
    this._initQuestions();
  }

  /***
   * this is to emit the event that will close the
   * sidebar.
   */
  @Output() closeSidebar: EventEmitter<void> = new EventEmitter<void>();

  // 'MARKET_TYPE' | 'FOLLOW_UP'
  private _templateType = 'MARKET_TYPE';

  private _isModalEnd: boolean;

  private _isModalPreview: boolean;

  private _filterNumber = 0;

  private _innovation: Innovation = <Innovation>{};

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _filterName = '';

  private _activatedCustomFilters: Array<string> = [];

  private _questions: Array<Question> = [];

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

  private _userLang = this._translateService.currentLang || 'en';

  private _isFinalConclusion = true;

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _worldmapFilterService: WorldmapFiltersService,
              private _tagService: TagsFiltersService,
              private _translateService: TranslateService,
              private _filterService: FilterService) { }

  ngOnChanges(): void {
    if (this.answers.length) {
      this._filterNumber = this.answers.length;
      this._filterService.filtersUpdate.pipe(takeUntil(this._ngUnsubscribe)).subscribe(() => {
        this._filterNumber = this._filterService.filter(this.answers).length;
      });
    }
  }

  private _loadSharedFiltersList() {
    this._innovationService.getFiltersList(this._innovation._id).pipe(first()).subscribe((results) => {
      if (Array.isArray(results)) {
        this._sharedFiltersList = results;
      }
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _initQuestions() {
    this._displayedQuestions = [];
    this._questions.forEach((question: Question) => {
      if (!this._showSection[question.identifier]) {
        this._showSection[question.identifier] = true;
      }
      if (!this._seeMore[question.identifier]) {
        this._seeMore[question.identifier] = false;
      }
      if (this._templateType === 'MARKET_TYPE' || question.controlType === 'checkbox' ||
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
      this.filterEverything(false, this.tagsList, 'TAG');
      this.questions.forEach(question => {
        this.filterEverything(false, [question], question.controlType);
      });
    }
  }

  public onSelectedContacts(event: Event) {
    event.preventDefault();
    this.closeSidebar.emit();
  }

  public openModalPreview(event: Event) {
    event.preventDefault();
    this._isModalPreview = true;
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
        console.error(err);
      });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'SIDEBAR_MARKET_REPORT.ERRORS.VIEW_ALREADY_EXIST');
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
      this._innovationService.save(this._innovation._id, this._innovation).pipe(first())
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
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          console.error(err);
        });
    }
  }

  /***
   * This function will make the project end and synthesis will be available to the client.
   * @param {Event} event
   */
  public onClickEndInnovationConfirm(event: Event) {
    event.preventDefault();
    if (this.isAdmin && this.isAdminSide) {
      this._innovationService.save(this._innovation._id, {status: 'DONE'}).pipe(first())
        .subscribe(() => {
          this._isModalEnd = false;
          this._translateNotificationsService.success('Success',
          'The project has been successfully ended, and the complete synthesis is available at the client side.');
      }, (err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
          console.error(err);
      });
    }
  }

  public deleteCustomFilter(event: Event, name: string) {
    event.preventDefault();
    this._innovationService.deleteFilter(this._innovation._id, encodeURIComponent(name))
      .pipe(first()).subscribe((result) => {
        if (result['ok'] === 1) {
          this._sharedFiltersList = this._sharedFiltersList.filter((filter) => filter.name !== name);
        }
        }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
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

  public checkCountry(event: Event) {
    event.preventDefault();
    this._worldmapFilterService.selectContinent((event.target as HTMLInputElement).name, (event.target as HTMLInputElement).checked);
  }

  public checkTag(event: Event, tagId: string) {
    event.preventDefault();
    this._tagService.checkTag(tagId, (event.target as HTMLInputElement).checked);
  }

  public checkAnswerTag(event: Event, questionIdentifier: string) {
    event.preventDefault();
    this._tagService.checkAnswerTag(questionIdentifier, (event.target as HTMLInputElement).name, (event.target as HTMLInputElement).checked);
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
      case 'radio':
      case 'checkbox':
        question = filterArray[0];
        if (isChecked) {
          this._filterService.deleteFilter(question.identifier);
        } else {
          const filterValue = question.options.reduce((acc, opt) => { acc[opt.identifier] = isChecked; return acc; }, {} as any);
          this._filterService.addFilter({
            status: <'CHECKBOX'|'RADIO'> question.controlType.toUpperCase(),
            questionId: question.identifier,
            value: filterValue
          });
        }
        break;
    }
  }

  get templateType(): string {
    return this._templateType;
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

  get questions(): Array<Question> {
    return this._questions;
  }

  get displayedQuestions(): Array<Question> {
    return this._displayedQuestions;
  }

  get continentsList(): Array<string> {
    return SharedWorldmapService.continentsList;
  }

  get tagsList(): Array<Tag> {
    return this._tagService.tagsList;
  }

  get answersTagsLists(): {[questionId: string]: Array<Tag>} {
    return this._tagService.answersTagsLists;
  }

  get filters() {
    return this._filterService.filters;
  }

  get filteredContinents() {
    return this._filterService.filters['worldmap'] ? this._filterService.filters['worldmap'].value : null;
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

  get userLang(): string {
    return this._userLang;
  }

  get isFinalConclusion(): boolean {
    return this._isFinalConclusion;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
