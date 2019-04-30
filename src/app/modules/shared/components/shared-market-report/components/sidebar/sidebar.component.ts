import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollConfig } from 'ngx-page-scroll';
import { FilterService } from '../../services/filters.service';
import { InnovationCommonService } from '../../../../../../services/innovation/innovation-common.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TagsFiltersService } from '../../services/tags-filter.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { WorldmapFiltersService } from '../../services/worldmap-filter.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { SharedFilter } from '../../models/shared-filter';
import { Tag } from '../../../../../../models/tag';
import { SharedWorldmapService } from "../../../shared-worldmap/shared-worldmap.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-market-report-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})

export class SidebarComponent implements OnInit {

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
  }

  @Input() set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  @Input() set isOwner(value: boolean) {
    this._isOwner = value;
  }

  @Input() set innovation(value: Innovation) {
    this._innovation = value;
  }

  @Input() set questions(value: Array<Question>) {
    this._questions = value;
  }

  private _answers: Array<Answer>;

  private _isAdmin: boolean;

  private _isOwner: boolean;

  private _filterName = '';

  private _innovation: Innovation;

  private _questions: Array<Question>;

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _activatedCustomFilters: Array<string> = [];

  private _showExportModal: boolean;

  private _showEndInnovationModal: boolean;

  userLang = '';

  tagsEndIndex = 6;

  constructor(private _activatedRoute: ActivatedRoute,
              private _filterService: FilterService,
              private _innovationCommonService: InnovationCommonService,
              private _innovationService: InnovationService,
              private _tagService: TagsFiltersService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _worldmapFilterService: WorldmapFiltersService,
              private _translateService: TranslateService) {

    PageScrollConfig.defaultDuration = 300;
    this.userLang = this._translateService.currentLang || this._translateService.getBrowserLang() || 'en';
  }

  ngOnInit() {

    // We put this here because we need the input being resolved before calling this functions
    this.loadSharedFiltersList();

    if (this._activatedRoute.snapshot.queryParams['filter']) {
      this.loadFilter(this._activatedRoute.snapshot.queryParams['filter']);
    }

  }

  public loadSharedFiltersList() {
    this._innovationService.getFiltersList(this._innovation._id).subscribe((results) => {
      if (Array.isArray(results)) {
        this._sharedFiltersList = results;
      }
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
    });
  }

  public shareNewFilter(event: Event): void {
    event.preventDefault();
    const data = {
      name: this._filterName,
      answers: this._filterService.filter(this._answers).map((answer) => answer._id)
    };
    this._innovationService.saveFilter(this._innovation._id, data).subscribe((res) => {
      this._sharedFiltersList.push(res);
      this._filterName = '';
    }, (error) => {
      this._translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  public loadFilter(name: string) {
    this._innovationService.getFilter(this._innovation._id, name).subscribe((result) => {
      if (result) {
        this._filterService.addFilter({
          status: 'CUSTOM',
          questionId: name,
          value: result.answers
        });
        this._activatedCustomFilters.push(name);
      }
    }, (error) => {
      this._translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  public unloadFilter(event: Event, name: string) {
    event.preventDefault();
    this._activatedCustomFilters = this._activatedCustomFilters.filter((f) => name !== f);
    this._filterService.deleteFilter(name);
  }

  public deleteCustomFilter(name: string) {
    this._innovationService.deleteFilter(this._innovation._id, name).subscribe((_result) => {
      this._sharedFiltersList = this._sharedFiltersList.filter((filter) => filter.name !== name);
    }, (error) => {
      this._translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  /***
   * This function will make the project end and synthesis will be available to the client.
   * @param {Event} event
   */
  public endInnovation(event: Event): void {
    event.preventDefault();
    this._showEndInnovationModal = false;
    this._innovationService.endProject(this._innovation._id).subscribe((response) => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
      this._innovation = response;
      this._innovationCommonService.setInnovation(this._innovation);
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  public checkCountry(event: Event) {
    event.preventDefault();
    this._worldmapFilterService.selectContinent(event.target['name'], event.target['checked']);
  }

  public checkOption(event: Event, question: Question) {
    event.preventDefault();
    const checked = event.target['checked'];
    let filterValue;
    if (this._filterService.filters[question.identifier]) {
      filterValue = this._filterService.filters[question.identifier].value;
    } else {
      filterValue = question.options.reduce((acc, opt) => { acc[opt.identifier] = true; return acc; }, {});
    }
    filterValue[event.target['name']] = checked;
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

  public checkTag(event: Event) {
    event.preventDefault();
    this._tagService.checkTag(event.target['name'], event.target['checked']);
  }

  public checkAnswerTag(event: Event, questionIdentifier: string) {
    event.preventDefault();
    this._tagService.checkAnswerTag(questionIdentifier, event.target['name'], event.target['checked']);
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

  public resetFilters(event: Event) {
    event.preventDefault();
    this._activatedCustomFilters = [];
    this._tagService.reselectEveryTags();
    this._worldmapFilterService.reset();
    this._filterService.reset();
  }

  get activatedCustomFilters() {
    return this._activatedCustomFilters;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get answersTagsLists(): {[questionId: string]: Array<Tag>} {
    return this._tagService.answersTagsLists;
  }

  get continentsList(): Array<string> {
    return SharedWorldmapService.continentsList;
  }

  get filteredContinents() {
    return this._filterService.filters['worldmap'] ? this._filterService.filters['worldmap'].value : null;
  }

  get filterName(): string {
    return this._filterName;
  }

  set filterName(value: string) {
    this._filterName = value;
  }

  get filters() {
    return this._filterService.filters;
  }

  get filtersCount() {
    return Object.keys(this._filterService.filters).length;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get sharedFiltersList(): Array<SharedFilter> {
    return this._sharedFiltersList;
  }

  get selectedTags(): {[t: string]: boolean} {
    return this._tagService.selectedTags;
  }

  get selectedAnswersTags(): {[questionId: string]: {[t: string]: boolean}} {
    return this._tagService.selectedAnswersTags;
  }

  get showExportModal(): boolean {
    return this._showExportModal;
  }

  set showExportModal(value: boolean) {
    this._showExportModal = value;
  }

  get showEndInnovationModal(): boolean {
    return this._showEndInnovationModal;
  }

  set showEndInnovationModal(value: boolean) {
    this._showEndInnovationModal = value;
  }

  get tagsList(): Array<Tag> {
    return this._tagService.tagsList;
  }

}
