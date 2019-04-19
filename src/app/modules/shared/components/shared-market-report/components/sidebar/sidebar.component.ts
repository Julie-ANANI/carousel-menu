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
import {SharedWorldmapService} from "../../../shared-worldmap/shared-worldmap.service";

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

  constructor(private activatedRoute: ActivatedRoute,
              private filterService: FilterService,
              private innovationCommonService: InnovationCommonService,
              private innovationService: InnovationService,
              private tagService: TagsFiltersService,
              private translateNotificationsService: TranslateNotificationsService,
              private worldmapFilterService: WorldmapFiltersService) {
    PageScrollConfig.defaultDuration = 600;
  }

  ngOnInit() {
    // We put this here because we need the input being resolved before calling this functions
    this.loadSharedFiltersList();
    if (this.activatedRoute.snapshot.queryParams['filter']) {
      this.loadFilter(this.activatedRoute.snapshot.queryParams['filter']);
    }
  }

  public loadSharedFiltersList() {
    this.innovationService.getFiltersList(this._innovation._id).subscribe((results) => {
      if (Array.isArray(results)) {
        this._sharedFiltersList = results;
      }
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  public shareNewFilter(event: Event): void {
    event.preventDefault();
    const data = {
      name: this._filterName,
      answers: this.filterService.filter(this._answers).map((answer) => answer._id)
    };
    this.innovationService.saveFilter(this._innovation._id, data).subscribe((res) => {
      this._sharedFiltersList.push(res);
      this._filterName = '';
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  public loadFilter(name: string) {
    this.innovationService.getFilter(this._innovation._id, name).subscribe((result) => {
      if (result) {
        this.filterService.addFilter({
          status: 'CUSTOM',
          questionId: name,
          value: result.answers
        });
        this._activatedCustomFilters.push(name);
      }
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  public unloadFilter(event: Event, name: string) {
    event.preventDefault();
    this._activatedCustomFilters = this._activatedCustomFilters.filter((f) => name !== f);
    this.filterService.deleteFilter(name);
  }

  public deleteCustomFilter(name: string) {
    this.innovationService.deleteFilter(this._innovation._id, name).subscribe((_result) => {
      this._sharedFiltersList = this._sharedFiltersList.filter((filter) => filter.name !== name);
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
  }

  /***
   * This function will make the project end and synthesis will be available to the client.
   * @param {Event} event
   */
  public endInnovation(event: Event): void {
    event.preventDefault();
    this._showEndInnovationModal = false;
    this.innovationService.endProject(this._innovation._id).subscribe((response) => {
      this.translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
      this._innovation = response;
      this.innovationCommonService.setInnovation(this._innovation);
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  public checkCountry(event: Event) {
    event.preventDefault();
    this.worldmapFilterService.selectContinent(event.target['name'], event.target['checked']);
  }

  public checkOption(event: Event, question: Question) {
    event.preventDefault();
    const checked = event.target['checked'];
    let filterValue;
    if (this.filterService.filters[question.identifier]) {
      filterValue = this.filterService.filters[question.identifier].value;
    } else {
      filterValue = question.options.reduce((acc, opt) => { acc[opt.identifier] = true; return acc; }, {});
    }
    filterValue[event.target['name']] = checked;
    const removeFilter = checked && Object.keys(filterValue).every((k) => filterValue[k] === true);
    if (removeFilter) {
      this.filterService.deleteFilter(question.identifier);
    } else {
      this.filterService.addFilter({
        status: <'CHECKBOX'|'RADIO'> question.controlType.toUpperCase(),
        questionId: question.identifier,
        value: filterValue
      });
    }
  }

  public checkTag(event: Event) {
    event.preventDefault();
    this.tagService.checkTag(event.target['name'], event.target['checked']);
  }

  public checkAnswerTag(event: Event, questionIdentifier: string) {
    event.preventDefault();
    this.tagService.checkAnswerTag(questionIdentifier, event.target['name'], event.target['checked']);
  }

  public deleteProfessionalFilter(event: Event, id: string) {
    event.preventDefault();
    const filterValue = this.filterService.filters['professionals'].value;
    delete filterValue[id];
    const removeFilter = Object.keys(filterValue).length === 0;
    if (removeFilter) {
      this.filterService.deleteFilter('professionals');
    } else {
      this.filterService.addFilter({
        status: 'PROFESSIONALS',
        questionId: 'professionals',
        value: filterValue
      });
    }
  }

  public resetFilters(event: Event) {
    event.preventDefault();
    this._activatedCustomFilters = [];
    this.tagService.reselectEveryTags();
    this.worldmapFilterService.reset();
    this.filterService.reset();
  }

  get activatedCustomFilters() {
    return this._activatedCustomFilters;
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get answersTagsLists(): {[questionId: string]: Array<Tag>} {
    return this.tagService.answersTagsLists;
  }

  get continentsList(): Array<string> {
    return SharedWorldmapService.continentsList;
  }

  get filteredContinents() {
    return this.filterService.filters['worldmap'] ? this.filterService.filters['worldmap'].value : null;
  }

  get filterName(): string {
    return this._filterName;
  }

  set filterName(value: string) {
    this._filterName = value;
  }

  get filters() {
    return this.filterService.filters;
  }

  get filtersCount() {
    return Object.keys(this.filterService.filters).length;
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
    return this.tagService.selectedTags;
  }

  get selectedAnswersTags(): {[questionId: string]: {[t: string]: boolean}} {
    return this.tagService.selectedAnswersTags;
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
    return this.tagService.tagsList;
  }

}
