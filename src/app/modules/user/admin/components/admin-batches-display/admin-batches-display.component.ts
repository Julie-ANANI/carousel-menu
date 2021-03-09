import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';
import { TranslateService } from '@ngx-translate/core';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { InnovCard } from '../../../../../models/innov-card';
import { SidebarInterface } from '../../../../sidebars/interfaces/sidebar-interface';
import { isPlatformBrowser } from '@angular/common';
import { SearchService } from '../../../../../services/search/search.service';

/***
 * this is to display the batches.
 * Example: Under the Market Tests tab.
 */

interface Statistics {
  percentFoundPros: number | string;
  percentFoundEmails: number | string;
  percentOkEmails: number | string;
  percentReceivedEmails: number | string;
}

@Component({
  selector: 'app-admin-batches-display',
  templateUrl: './admin-batches-display.component.html',
  styleUrls: ['./admin-batches-display.component.scss']
})

export class AdminBatchesDisplayComponent implements OnInit {

  private _weekBatches: Array<any> = [[], [], [], [], []];
  // => [['DATE', batch, batch,..]...]

  private _nbDaysOfStats = 1;

  private _selectedBatch: any;

  private _statistics: Statistics = {
    percentFoundPros: null,
    percentFoundEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };

  private _dateNow = new Date();

  private _currentLang = this._translateService.currentLang || 'en';

  private _selectedInnovation: InnovCard = <InnovCard>{};

  private _sidebarTemplate: SidebarInterface = <SidebarInterface>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _dashboardService: DashboardService,
              private _searchService: SearchService,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      this._getPeriodStats();
      this._getWeek();
    }
  }

  private _getPeriodStats() {
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
  }

  private _getWeek() {
    const now = Date.now();
    this._dateNow = new Date(now);
    this._getNextData();
  }

  private _getNextData() {
    this._dashboardService.getNextDateSend(this._dateNow.toString()).pipe(first()).subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
      this._sortBatches();
      console.log(this._weekBatches);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _sortBatches() {
    this._weekBatches = this._weekBatches.map((days) => {
      const _days = days.slice(1).sort((a: any, b: any) => {
        const nameA = a['innovation']['name'] && a['innovation']['name'].toLowerCase();
        const nameB = b['innovation']['name'] && b['innovation']['name'].toLowerCase();
        return nameA.localeCompare(nameB);
      });
      return days.slice(0, 1).concat(_days);
    });
  }

  public onClickLast() {
    this._dateNow.setDate(this._dateNow.getDate() - 7);
    this._getNextData();
  }

  public onClickNext() {
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

  public getState(b: any) {
    const day = this._dateNow.getDay();

    let Now = new Date(this._dateNow);
    const beginWeek = new Date(Now.setDate(Now.getDate() - day));

    Now = new Date(this._dateNow);
    const endWeek = new Date(Now.setDate(Now.getDate() - day + 6));

    const FM = new Date(b.firstMail);
    const SM = new Date(b.secondMail);
    const TM = new Date(b.thirdMail);

    if ((beginWeek < TM) && (TM < endWeek)) {
      return 2;
    }

    if ((beginWeek < SM) && (SM < endWeek)) {
      return 1;
    }

    if ((beginWeek < FM) && (FM < endWeek)) {
      return 0;
    }

  }

  public showPreview(event: Event, batch: any) {
    event.preventDefault();
    this._selectedBatch = batch;

    if (this._selectedBatch !== null) {
      this._innovationService.getInnovationCard(this._selectedBatch.innovation.innovationCards[0].id)
        .pipe(first()).subscribe((card) => {
        this._selectedInnovation = card;
        this._sidebarTemplate = {
          animate_state: 'active',
          title: 'Innovation Preview',
          size: '726px'
        };
      }, (err: HttpErrorResponse) => {
        console.error(err);
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      });
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

  get selectedInnovation(): InnovCard {
    return this._selectedInnovation;
  }

  get sidebarTemplate(): SidebarInterface {
    return this._sidebarTemplate;
  }

  set sidebarTemplate(value: SidebarInterface) {
    this._sidebarTemplate = value;
  }

}
