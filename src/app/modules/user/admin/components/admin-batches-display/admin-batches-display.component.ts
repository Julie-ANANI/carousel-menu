import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovCard } from '../../../../../models/innov-card';
import { SidebarInterface } from '../../../../sidebars/interfaces/sidebar-interface';
import { isPlatformBrowser } from '@angular/common';
// import { SearchService } from '../../../../../services/search/search.service';
import {Batch} from '../../../../../models/batch';
import {InnovationFrontService} from '../../../../../services/innovation/innovation-front.service';

/***
 * this is to display the batches.
 * Example: Under the Market Tests tab.
 */

/*interface Statistics {
  percentFoundPros: number | string;
  percentFoundEmails: number | string;
  percentOkEmails: number | string;
  percentReceivedEmails: number | string;
}*/

@Component({
  selector: 'app-admin-batches-display',
  templateUrl: './admin-batches-display.component.html',
  styleUrls: ['./admin-batches-display.component.scss']
})

export class AdminBatchesDisplayComponent implements OnInit {

  private _weekBatches: Array<any> = [[], [], [], [], []];
  // => [['DATE', batch, batch,..]...]

  // private _nbDaysOfStats = 1;

  private _selectedBatch: any;

  /*private _statistics: Statistics = {
    percentFoundPros: null,
    percentFoundEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };*/

  private _dateNow = new Date();

  private _currentLang = this._translateService.currentLang || 'en';

  private _selectedInnovCard: InnovCard = <InnovCard>{};

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{};

  private _isLoading = true;

  private static _sortByName(batches: Array<Batch>) {
    return batches.sort((a: Batch, b: Batch) => {
      const nameA = a.innovation.name && a.innovation.name.toLowerCase();
      const nameB = b.innovation.name && b.innovation.name.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _dashboardService: DashboardService,
              // private _searchService: SearchService,
              private _translateService: TranslateService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      // this._getPeriodStats();
      this._getWeek();
    }
  }


  /**
   * commented on 18th Mar,2021 because no idea where we are using this.
   * @private
   */
  /*private _getPeriodStats() {
    this._searchService.getEmailStats(this._nbDaysOfStats).pipe(first()).subscribe((stats: any) => {

      const totalMails = stats.total && stats.total.domainNotFound && stats.total.found && stats.total.timeOut
        ? stats.total.domainNotFound + stats.total.found + stats.total.notFound + stats.total.timeOut : 'NA';

      this._statistics.percentFoundEmails = totalMails && stats && stats.total && stats.total.found
        ? Math.round(stats.total.found / totalMails * 100) : 'NA';

      this._statistics.percentFoundPros = 'NA';

      this._statistics.percentOkEmails = stats && stats.total && stats.total.found && stats.total.confidence
        ? Math.round((stats.total.confidence['100'] || 0) / stats.total.found * 100) : 'NA';

      this._statistics.percentReceivedEmails = 'NA';
      }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }*/

  private _getWeek() {
    const now = Date.now();
    this._dateNow = new Date(now);
    this._getNextData();
  }

  private _getNextData() {
    this._dashboardService.getNextDateSend(this._dateNow.toString()).pipe(first()).subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
      console.log(batches);
      this._sortBatches();
      this._isLoading = false;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  /**
   * first sort by shot then by innovation name.
   * @private
   */
  private _sortBatches() {
    this._weekBatches = this._weekBatches.map((batches) => {
      let _fm = batches.slice(1).filter((batch: Batch) => batch.status === 0);
      let _sm = batches.slice(1).filter((batch: Batch) => batch.status === 1);
      let _tm = batches.slice(1).filter((batch: Batch) => batch.status === 2);
      _fm = AdminBatchesDisplayComponent._sortByName(_fm);
      _sm = AdminBatchesDisplayComponent._sortByName(_sm);
      _tm = AdminBatchesDisplayComponent._sortByName(_tm);
      return batches.slice(0, 1).concat(_fm, _sm, _tm);
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
   * instead of using this to show shot colors we are using batch.status.
   * @param
   */
  public getState(b: any) {
    const day = this._dateNow.getDay();

    let Now = new Date(this._dateNow);
    const beginWeek = new Date(Now.setDate(Now.getDate() - day));

    Now = new Date(this._dateNow);
    const endWeek = new Date(Now.setDate(Now.getDate() - day + 6));

    const FM = new Date(b.firstMail);
    const SM = new Date(b.secondMail);
    const TM = new Date(b.thirdMail);

    if ((beginWeek < FM) && (FM < endWeek)) {
      return 0;
    }

    if ((beginWeek < SM) && (SM < endWeek)) {
      return 1;
    }

    if ((beginWeek < TM) && (TM < endWeek)) {
      return 2;
    }

  }

  public showPreview(event: Event, batch: any) {
    event.preventDefault();
    this._selectedBatch = batch;
    this._selectedInnovCard = InnovationFrontService.currentLangInnovationCard(
      this._selectedBatch.innovation, this._currentLang, 'CARD'
    );

    if (this._selectedInnovCard && this._selectedInnovCard._id) {
      this._sidebarTemplate = {
        animate_state: 'active',
        title: 'Innovation Preview',
        size: '726px'
      };
    } else {
      this._translateNotificationsService.error('Error', 'We could not find the innovation card.');
    }
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
