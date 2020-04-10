import { Component, OnInit } from '@angular/core';
import {DashboardService} from '../../../../../services/dashboard/dashboard.service';
import {first} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../../../../services/error/error-front';
import {TranslateService} from '@ngx-translate/core';
import {InnovationService} from '../../../../../services/innovation/innovation.service';
import {InnovCard} from '../../../../../models/innov-card';
import {SidebarInterface} from '../../../../sidebars/interfaces/sidebar-interface';

interface Statistics {
  percentFoundPros: number,
  percentFoundEmails: number,
  percentOkEmails: number,
  percentReceivedEmails: number
}

@Component({
  selector: 'admin-batches-display',
  templateUrl: './admin-batches-display.component.html',
  styleUrls: ['./admin-batches-display.component.scss']
})

export class AdminBatchesDisplayComponent implements OnInit {

  weekBatches: Array<any> = [[], [], [], [], []];
  // => [['DATE', batch, batch,..]...]

  nbDaysOfStats = 1;

  selectedBatch: any;

  statistics: Statistics = {
    percentFoundPros: null,
    percentFoundEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };

  dateNow = new Date();

  currentLang = this._translateService.currentLang || 'en';

  selectedInnovation: InnovCard = <InnovCard>{};

  sidebar: SidebarInterface = <SidebarInterface>{};

  constructor(private _dashboardService: DashboardService,
              private _translateService: TranslateService,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  ngOnInit() {
  }

  public onClickLast() {
    this.dateNow.setDate(this.dateNow.getDate() - 7);
    this._dashboardService.getNextDateSend(this.dateNow.toString()).pipe(first()).subscribe((batches: Array<any>) => {
      this.weekBatches = batches;
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
  }

  public onClickNext() {
    this.dateNow.setDate(this.dateNow.getDate() + 7);
    this._dashboardService.getNextDateSend(this.dateNow.toString()).subscribe((batches: Array<any>) => {
      this.weekBatches = batches;
    }, (err: HttpErrorResponse) => {
      console.error(err);
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
    });
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

    if (this.currentLang === 'fr') {
      result = day + '/' + month;
    } else {
      result = month + '/' + day;
    }

    return result;

  }

  public getState(b: any) {
    const day = this.dateNow.getDay();

    let Now = new Date(this.dateNow);
    const beginWeek = new Date(Now.setDate(Now.getDate() - day));

    Now = new Date(this.dateNow);
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
    this.selectedBatch = batch;

    if (this.selectedBatch !== null) {
      this._innovationService.getInnovationCard(this.selectedBatch.innovation.innovationCards[0].id)
        .pipe(first()).subscribe((card) => {
        this.selectedInnovation = card;
        this.sidebar = {
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

}
