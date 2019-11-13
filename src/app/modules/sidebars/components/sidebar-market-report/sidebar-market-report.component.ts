import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Innovation } from '../../../../models/innovation';
import { SharedFilter } from '../../../shared/components/shared-market-report/models/shared-filter';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../services/notifications/notifications.service';
import { FilterService } from '../../../shared/components/shared-market-report/services/filters.service';
import { Answer } from '../../../../models/answer';
import { first } from 'rxjs/operators';
import { Question } from '../../../../models/question';

@Component({
  selector: 'sidebar-market-report',
  templateUrl: './sidebar-market-report.component.html',
  styleUrls: ['./sidebar-market-report.component.scss']
})

export class SidebarMarketReportComponent implements OnInit {

  @Input() set innovation(value: Innovation) {
    if (value) {
      this._innovation = value;
      this._loadSharedFiltersList();
    }
  }

  @Input() set answers(value: Array<Answer>) {
    this._answers = value;
  }

  @Input() set questions(value: Array<Question>) {
    console.log(value);
    this._questions = value;
  }

  @Input() set templateType(value: string) {
    this._templateType = value;
  }

  /***
   * this is to emit the event that will close the
   * sidebar.
   */
  @Output() closeSidebar: EventEmitter<boolean> = new EventEmitter<boolean>();

  private _templateType: string;

  private _innovation: Innovation = <Innovation> {};

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _filterName = '';

  private _answers: Array<Answer> = [];

  private _activatedCustomFilters: Array<string> = [];

  private _questions: Array<Question> = [];

  public seeMore: {[questionId: string]: boolean} = {};

  constructor(private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
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


}
