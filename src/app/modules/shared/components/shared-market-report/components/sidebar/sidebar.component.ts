import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollConfig } from 'ngx-page-scroll';
import { FilterService } from '../../services/filters.service';
import { InnovationCommonService } from '../../../../../../services/innovation/innovation-common.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
import { SharedWorldmapService } from '../../../shared-worldmap/shared-worldmap.service';
import { Answer } from '../../../../../../models/answer';
import { Innovation } from '../../../../../../models/innovation';
import { Question } from '../../../../../../models/question';
import { SharedFilter } from '../../models/shared-filter';

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

  private _continentList: Array<string>;

  private _isAdmin: boolean;

  private _isOwner: boolean;

  private _filterName = '';

  private _innovation: Innovation;

  private _questions: Array<Question>;

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _showExportModal: boolean;

  private _showEndInnovationModal: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private filterService: FilterService,
              private innovationCommonService: InnovationCommonService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService,
              private worldmapService: SharedWorldmapService) {
    PageScrollConfig.defaultDuration = 600;
    this._continentList = this.worldmapService.continents;
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
          questionTitle: {en: result.name},
          value: result.answers
        });
      }
    }, (error) => {
      this.translateNotificationsService.error('ERROR.ERROR', error.message);
    });
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
    const continentName = event.target['name'];
    const checked = event.target['checked'];
    const filteredContinents = this.filteredContinents;
    if (filteredContinents) {
      filteredContinents[continentName] = checked;
      if (SharedWorldmapService.areAllContinentChecked(filteredContinents)) {
        this.filterService.deleteFilter('worldmap');
      } else {
        this.filterService.addFilter(
          {
            status: 'COUNTRIES',
            value: filteredContinents,
            questionId: 'worldmap',
            questionTitle: {en: 'worldmap', fr: 'mappemonde'}
          }
        );
      }
    } else {
      this.filterService.addFilter(
        {
          status: 'COUNTRIES',
          value: this.worldmapService.continents.reduce((acc, c) => {
            acc[c] = (c === continentName) ? checked : true;
            return acc;
          }, {}),
          questionId: 'worldmap',
          questionTitle: {en: 'worldmap', fr: 'mappemonde'}
        }
      );
    }
  }

  get answers(): Array<Answer> {
    return this._answers;
  }

  get continentList(): Array<string> {
    return this._continentList;
  }

  get isAdmin(): boolean {
    return this._isAdmin;
  }

  get isOwner(): boolean {
    return this._isOwner;
  }

  get filterName(): string {
    return this._filterName;
  }

  set filterName(value: string) {
    this._filterName = value;
  }

  get innovation(): Innovation {
    return this._innovation;
  }

  get questions(): Array<Question> {
    return this._questions;
  }

  get sharedFiltersList(): Array<SharedFilter> {
    return this._sharedFiltersList;
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

  get filteredContinents() {
    return this.filterService.filters['worldmap'] ? this.filterService.filters['worldmap'].value : null;
  }

}
