import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageScrollConfig } from 'ngx-page-scroll';
import { FilterService } from '../../services/filters.service';
import { InnovationService } from '../../../../../../services/innovation/innovation.service';
import { TranslateNotificationsService } from '../../../../../../services/notifications/notifications.service';
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

  private _isOwner: boolean;

  private _filterName = '';

  private _innovation: Innovation;

  private _questions: Array<Question>;

  private _sharedFiltersList: Array<SharedFilter> = [];

  private _showExportModal: boolean;

  constructor(private activatedRoute: ActivatedRoute,
              private filterService: FilterService,
              private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) {
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

  get answers(): Array<Answer> {
    return this._answers;
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

}
