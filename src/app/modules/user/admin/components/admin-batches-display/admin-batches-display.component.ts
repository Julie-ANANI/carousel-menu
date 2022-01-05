import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../services/translate-notifications/translate-notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovCard } from '../../../../../models/innov-card';
import { SidebarInterface } from '../../../../sidebars/interfaces/sidebar-interface';
import { isPlatformBrowser } from '@angular/common';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';

/***
 * this is to display the batches.
 * Example: Under the Market Tests tab.
 */

@Component({
  selector: 'app-admin-batches-display',
  templateUrl: './admin-batches-display.component.html',
  styleUrls: ['./admin-batches-display.component.scss']
})

export class AdminBatchesDisplayComponent implements OnInit {

  private _weekBatches: Array<any> = [[], [], [], [], []];
  // => [['DATE', batch, batch,..]...]

  private _selectedBatch: any;

  private _dateNow = new Date();

  private _currentLang = this._translateService.currentLang || 'en';

  private _selectedInnovCard: InnovCard = <InnovCard>{};

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{};

  private _isLoading = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _dashboardService: DashboardService,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._getWeek();
    }
  }

  private _getWeek() {
    const now = Date.now();
    this._dateNow = new Date(now);
    this._getNextData();
  }

  private _getNextData() {
    this._dashboardService.getNextDateSend(this._dateNow.toString()).pipe(first()).subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
      this._isLoading = false;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Batch Error...', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onClickLast() {
    this._isLoading = true;
    this._dateNow.setDate(this._dateNow.getDate() - 7);
    this._getNextData();
  }

  public onClickNext() {
    this._isLoading = true;
    this._dateNow.setDate(this._dateNow.getDate() + 7);
    this._getNextData();
  }

  public getDateString(d: any): string {
    let result = '';
    let day = d.split('/')[0];
    let month = d.split('/')[1];

    day = ('0' + day).slice(-2);

    month = Number(month);
    month ++;
    month = month.toString();
    month = ('0' + month).slice(-2);

    if (this._currentLang === 'fr') {
      result = day + '/' + month;
    } else {
      result = month + '/' + day;
    }

    return result;

  }

  /**
   *
   * @param
   */
  public getState(b: any, index: number) {
    const batchDay = this._weekBatches.length && this._weekBatches[index] && this._weekBatches[index][0] || '';
    const day = this._dateNow.getDay();

    let Now = new Date(this._dateNow);
    const beginWeek = new Date(Now.setDate(Now.getDate() - day));

    Now = new Date(this._dateNow);
    const endWeek = new Date(Now.setDate(Now.getDate() - day + 6));

    const FM = new Date(b.firstMail);
    const SM = new Date(b.secondMail);
    const TM = new Date(b.thirdMail);

    if ((beginWeek < TM) && (TM < endWeek) && batchDay === TM.getDate() + '/' + TM.getMonth()) {
      return 2;
    }

    if ((beginWeek < SM) && (SM < endWeek) && batchDay === SM.getDate() + '/' + SM.getMonth()) {
      return 1;
    }

    if ((beginWeek < FM) && (FM < endWeek) && batchDay === FM.getDate() + '/' + FM.getMonth()) {
      return 0;
    }

  }

  public showPreview(event: Event, batch: any) {
    event.preventDefault();
    this._selectedBatch = batch;
    let lastInnovationId = '';
    const innovationId = this._selectedBatch && this._selectedBatch.innovation
      && this._selectedBatch.innovation._id  || '';

    if (innovationId) {
      if (lastInnovationId !== innovationId) {
        this._innovationService.getInnovCardsByReference(innovationId)
          .pipe(first())
          .subscribe((cards) => {
            this._selectedInnovCard = InnovationFrontService.currentLangCard(cards, this._currentLang);
            this._openSidebar();
            lastInnovationId = innovationId;
          }, (err: HttpErrorResponse) => {
            console.error(err);
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
          });
      } else {
        this._openSidebar();
      }
    } else {
      this._translateNotificationsService.error('Error', 'We could not find the innovation card.');
    }
  }

  private _openSidebar() {
    this._sidebarTemplate = {
      animate_state: 'active',
      title: 'Innovation Preview',
      size: '726px'
    };
  }

  get weekBatches(): Array<any> {
    return this._weekBatches;
  }

  get selectedBatch(): any {
    return this._selectedBatch;
  }

  get dateNow(): Date {
    return this._dateNow;
  }

  get currentLang(): string {
    return this._currentLang;
  }

  get selectedInnovCard(): InnovCard {
    return this._selectedInnovCard;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = value;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

}
