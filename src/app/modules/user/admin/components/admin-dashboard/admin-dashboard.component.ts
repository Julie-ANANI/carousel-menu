import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { SearchService } from '../../../../../services/search/search.service';
import { User } from '../../../../../models/user.model';
import { Subject } from 'rxjs';
import { InnovationService } from '../../../../../services/innovation/innovation.service';
import { InnovCard } from '../../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';
import { SidebarInterface } from '../../../../sidebar/interfaces/sidebar-interface';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {

  private _spinnerDisplay = true;

  public operators: Array<User> = [];

  public operatorId = '';

  private _dateNow = new Date();

  public nbDaysOfStats = 1;

  sidebarTemplateValue: SidebarInterface = {};

  private _selectedInnovation: InnovCard;

  private _selectedBatch: any;

  private _weekBatches: Array<any> = [[], [], [], [], []];
  // => [['DATE', batch, batch,..]...]

  operatorData: {
    nbProjectsToValidate: number,
    nbProjectsToTreat: number
  } = {
    nbProjectsToValidate: null,
    nbProjectsToTreat: null
  };

  statistics: {
    percentFoundPros: number | 'NA',
    percentFoundEmails: number | 'NA',
    percentOkEmails: number | 'NA',
    percentReceivedEmails: number | 'NA'
  } = {
    percentFoundPros: null,
    percentFoundEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };

  private _refreshNeededEmitter = new Subject<any>();

  constructor(private translateTitleService: TranslateTitleService,
              private dashboardService: DashboardService,
              private searchService: SearchService,
              private authService: AuthService,
              private innovationService: InnovationService,
              private translateService: TranslateService) { }

  ngOnInit() {

    this.translateTitleService.setTitle('Dashboard');

    if (this.authService.user && this.authService.user.isOperator) {
      this.operatorId = this.authService.user.id;
    }

    this.dashboardService.getOperators().subscribe((operators: any) => {
      this.operators = operators.result.sort((a: User, b: User) => {
        return a.firstName > b.firstName ? 1 : -1;
      });
    });

    this.dashboardService
      .getOperatorData(this.operatorId)
      .subscribe((operatorData: any) => this.operatorData = operatorData);

    this.getPeriodStats();

    this.getWeek();

    this._spinnerDisplay = false;

  }

  newOperatorSelected(operatorId: string) {
    this.refreshNeededEmitter.next({
      operatorId: operatorId
    });
    this.dashboardService
      .getOperatorData(this.operatorId)
      .subscribe((operatorData: any) => this.operatorData = operatorData);
  }

  public getPeriodStats() {
    this.searchService
      .getEmailStats(this.nbDaysOfStats)
      .subscribe((stats: any) => {
        const totalMails = stats.total.domainNotFound + stats.total.found + stats.total.notFound + stats.total.timeOut;
        this.statistics.percentFoundEmails = totalMails ? Math.round(stats.total.found / totalMails * 100) : 'NA';
        this.statistics.percentFoundPros = 'NA';
        this.statistics.percentOkEmails =  stats.total.found ? Math.round((stats.total.confidence['100'] || 0) / stats.total.found * 100) : 'NA';
        this.statistics.percentReceivedEmails = 'NA';
      });
  }

  getWeek() {
    const now = Date.now();
    this._dateNow = new Date(now);
    this.dashboardService.getNextDateSend(this._dateNow.toString()).subscribe( (batches: Array<any>) => {
        this._weekBatches = batches;
    });
  }

  getNextWeek() {
    this._dateNow.setDate(this._dateNow.getDate() + 7);
    this.dashboardService.getNextDateSend(this._dateNow.toString()).subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
    });
  }

  getLastWeek() {
    this._dateNow.setDate(this._dateNow.getDate() - 7);
    this.dashboardService.getNextDateSend(this._dateNow.toString()).subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
    });
  }

  getState(b: any) {
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

  getDateString(d: any): string {
    let result = '';
    let day = d.split('/')[0];
    let month = d.split('/')[1];

    day = ('0' + day).slice(-2);

    month = Number(month);
    month ++;
    month = month.toString();
    month = ('0' + month).slice(-2);

    if (this.translateService.currentLang === 'fr') {
      result = day + '/' + month;
    } else {
      result = month + '/' + day;
    }

    return result;

  }

  showPreview(event: Event, batch: any) {
    event.preventDefault();
    this._selectedBatch = batch;
    if (this._selectedBatch !== null) {
      this.innovationService.getInnovationCard(this._selectedBatch.innovation.innovationCards[0].id).pipe(first()).subscribe((card: any) => {
        this._selectedInnovation = card;
        this.sidebarTemplateValue = {
          animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
          title: 'PROJECT_MODULE.SETUP.PITCH.INNOVATION_PREVIEW',
          size: '726px'
        };
      });
    }

  }

  closeSidebar(value: SidebarInterface) {
    this.sidebarTemplateValue.animate_state = value.animate_state;
  }

  get refreshNeededEmitter(): Subject<any> {
    return this._refreshNeededEmitter;
  }

  get adminLevel(): number {
    return this.authService.adminLevel;
  }


  get weekBatches(): any {
    return this._weekBatches;
  }

  get selectedInnovation(): any {
    return this._selectedInnovation;
  }
  get selectedBatch(): any {
    return this._selectedBatch;
  }

  get dateNow(): any {
    return this._dateNow;
  }

  get spinnerDisplay(): boolean {
    return this._spinnerDisplay;
  }

}
