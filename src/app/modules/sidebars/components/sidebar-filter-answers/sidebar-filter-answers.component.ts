import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Innovation } from '../../../../models/innovation';
import { SharedFilter } from '../../../shared/components/shared-market-report/models/shared-filter';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { FilterService } from '../../../shared/components/shared-market-report/services/filters.service';
import { Answer } from '../../../../models/answer';
import { first } from 'rxjs/operators';
import { Question } from '../../../../models/question';
import { SharedWorldmapService } from "../../../shared/components/shared-worldmap/services/shared-worldmap.service";
import {Tag} from "../../../../models/tag";
import {TagsFiltersService} from "../../../shared/components/shared-market-report/services/tags-filter.service";
import {WorldmapFiltersService} from "../../../shared/components/shared-market-report/services/worldmap-filter.service";

@Component({
  selector: 'sidebar-filter-answers',
  templateUrl: './sidebar-filter-answer.component.html',
  styleUrls: ['./sidebar-filter-answers.component.scss']
})

export class SidebarFilterAnswersComponent implements OnInit {

  @Input() set innovation(value: Innovation) {
    if (value) {
      this._innovation = value;
      this._loadSharedFiltersList();
    }
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
    this._filterNumber = value.length;
    this._filterService.filtersUpdate.subscribe(() => {
      this._filterNumber = this._filterService.filter(this._answers).length;
    });
  }

  @Input() set templateType(value: string) {
    this._templateType = value;
    if (value === 'market-report') {
      this.showSection.map = true;
      this.showSection.professionals = true;
    }
  }

  @Input() set questions(value: Array<Question>) {
    this._questions = value;
    this._displayedQuestions = [];
    this._questions.forEach((question: Question) => {
      this.showSection[question.identifier] = this._templateType === 'market-report';
      if (this.templateType === 'market-report' || question.controlType === 'checkbox' ||
        question.controlType === 'radio' || this.answersTagsLists[question.identifier] &&
        this.answersTagsLists[question.identifier].length) {
        this._displayedQuestions.push(question);
      }
    });
  }

  @Input() set reportShared(value: boolean) {
    this._reportShared = value;
  }

  @Input() set isAdmin(value: boolean) {
    this._isAdmin = value;
  }

  @Input() set isAdminSide(value: boolean) {
    this._isAdminSide = value;
  }

  @Input() set isOwner(value: boolean) {
    this._isOwner = value;
  }


  /***
   * this is to emit the event that will close the
   * sidebar.
   */
  @Output() closeSidebar: EventEmitter<null> = new EventEmitter<null>();

  private _templateType: string;

  private _reportShared: boolean;

  private _isAdmin: boolean;

  private _isAdminSide: boolean;

  private _isOwner: boolean;

  private _modalEndInnovation: boolean;

  private _modalPreviewInnovation: boolean;

  private _modalExport: boolean;

  private _modalResetReport: boolean;

  private _filterNumber = 0;

  private _innovation: Innovation = <Innovation> {};

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _filterName = '';

  private _answers: Array<Answer> = [];

  private _activatedCustomFilters: Array<string> = [];

  private _questions: Array<Question> = [];

  private _displayedQuestions: Array<Question> = [];

  public showSection: {[questionId: string]: boolean} = {};

  public seeMore: {[questionId: string]: boolean} = {};

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _worldmapFilterService: WorldmapFiltersService,
              private _tagService: TagsFiltersService,
              private _filterService: FilterService,) { }

  ngOnInit() {
  }

  private _loadSharedFiltersList() {
    this._innovationService.getFiltersList(this._innovation._id).pipe(first()).subscribe((results) => {
      if (Array.isArray(results)) {
        this._sharedFiltersList = results;
      }
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'SIDEBAR_MARKET_REPORT.ERRORS.VIEWS');
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
      this._questions.forEach(question => {
        this.filterEverything(false, [question], question.controlType);
      });
    }
  }

  public onClickSelect() {
    this.closeSidebar.emit();
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

    const find = this._sharedFiltersList.find((filter) => filter.name.toLowerCase() === this._filterName.toLowerCase());

    if (!find) {

      const data = {
        name: this._filterName,
        answers: this._filterService.filter(this._answers).map((answer) => answer._id)
      };

      this._innovationService.saveFilter(this._innovation._id, data).pipe(first()).subscribe((res) => {
        this._sharedFiltersList.push(res);
        this._filterName = '';
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
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


  public onClickPreviewConfirm(event: Event) {
    event.preventDefault();
    this._innovation.previewMode = !this._innovation.previewMode;

    this._innovationService.save(this._innovation._id, this._innovation).subscribe((response: Innovation) => {
      if (response.previewMode) {
        this._translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_VISIBLE');
      } else {
        this._translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS_NOT_VISIBLE');
      }
    }, () => {
      this._innovation.previewMode = !this._innovation.previewMode;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

    this._modalPreviewInnovation = false;

  }


  public onClickResetConfirm(event: Event) {
    event.preventDefault();
    const totalSections = this._innovation.executiveReport.totalSections;
    const sections = this._innovation.executiveReport.sections;

    this._innovation.executiveReport.totalSections = 0;
    this._innovation.executiveReport.sections = [];

    this._innovationService.save(this._innovation._id, this._innovation).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'The executive report has been reset successfully.');
    }, () => {
      this._innovation.executiveReport.totalSections = totalSections;
      this._innovation.executiveReport.sections = sections;
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

    this._modalResetReport = false;

  }


  /***
   * This function will make the project end and synthesis will be available to the client.
   * @param {Event} event
   */
  public onClickEndInnovationConfirm(event: Event) {
    event.preventDefault();

    this._innovationService.save(this._innovation._id, {status: 'DONE'}).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'MARKET_REPORT.MESSAGE_SYNTHESIS');
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });

    this._modalEndInnovation = false;

  }

  public deleteCustomFilter(event: Event, name: string) {
    event.preventDefault();

    this._innovationService.deleteFilter(this._innovation._id, encodeURIComponent(name)).pipe(first()).subscribe((result) => {
      if (result['ok'] === 1) {
        this._sharedFiltersList = this._sharedFiltersList.filter((filter) => filter.name !== name);
      }
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });

  }

  public loadFilter(name: string) {

    const find = this._activatedCustomFilters.find((filter) => filter.toLowerCase() === name.toLowerCase());

    if (!find) {
      this._innovationService.getFilter(this._innovation._id, encodeURIComponent(name)).pipe(first()).subscribe((result) => {
        if (result) {

          this._filterService.addFilter({
            status: 'CUSTOM',
            questionId: name,
            value: result.answers
          });

          this._activatedCustomFilters.push(name);

        }
      }, () => {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
      });
    } else {
      this._translateNotificationsService.error('ERROR.ERROR', 'SIDEBAR_MARKET_REPORT.ERRORS.VIEW_ALREADY_ACTIVATED');
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

  get answers(): Array<Answer> {
    return this._answers;
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

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  get isAdminSide(): boolean {
    return this._isAdminSide;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get reportShared(): boolean {
    return this._reportShared;
  }

  get modalEndInnovation(): boolean {
    return this._modalEndInnovation;
  }

  set modalEndInnovation(value: boolean) {
    this._modalEndInnovation = value;
  }

  get modalPreviewInnovation(): boolean {
    return this._modalPreviewInnovation;
  }

  set modalPreviewInnovation(value: boolean) {
    this._modalPreviewInnovation = value;
  }

  get modalExport(): boolean {
    return this._modalExport;
  }

  set modalExport(value: boolean) {
    this._modalExport = value;
  }

  get modalResetReport(): boolean {
    return this._modalResetReport;
  }

  set modalResetReport(value: boolean) {
    this._modalResetReport = value;
  }

  get selectedAnswersTags(): {[questionId: string]: {[t: string]: boolean}} {
    return this._tagService.selectedAnswersTags;
  }


}
