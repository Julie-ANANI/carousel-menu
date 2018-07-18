import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SearchService } from '../../../../services/search/search.service';
import { User } from '../../../../models/user.model';
import { Subject } from 'rxjs/Subject';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { InnovCard } from '../../../../models/innov-card';
import { TranslateService } from '@ngx-translate/core';
import { Template } from '../../../sidebar/interfaces/template';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public operators: Array<User> = [];
  public operatorId = '';

  private _modalSelected = false;
  private _dateNow = new Date();

  public nbDaysOfStats = 1;

  sidebarTemplateValue: Template = {};
  private _selectedInnovation: InnovCard;
  private _selectedBatch: any;

  private _weekBatches: Array<any> = [[], [], [], [], []];
  // => [['DATE', batch, batch,..]...]

  public operatorData: {
    nbProjectsToValidate: number,
    nbProjectsToTreat: number
  } = {
    nbProjectsToValidate: null,
    nbProjectsToTreat: null
  };

  public statistics: {
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

  constructor(private _titleService: TranslateTitleService,
              private _dashboardService: DashboardService,
              private _searchService: SearchService,
              private _authService: AuthService,
              private _innovationService: InnovationService,
              private _translateService: TranslateService) { }

  ngOnInit(): void {

    this._titleService.setTitle('Admin Dashboard');

    if (this._authService.user && this._authService.user.isOperator) {
      this.operatorId = this._authService.user.id;
    }

    this._dashboardService.getOperators().first().subscribe((operators) => this.operators = operators.result);

    this._dashboardService.getOperatorData(this.operatorId).first().subscribe((operatorData) => this.operatorData = operatorData);

    this.getPeriodStats();


    this.getWeek();
  }

  public newOperatorSelected(operatorId: string) {
    this.refreshNeededEmitter.next({
      operatorId: operatorId
    });
    this._dashboardService.getOperatorData(this.operatorId).first().subscribe((operatorData) => this.operatorData = operatorData);
  }

  public getPeriodStats() {
    this._searchService.getEmailStats(this.nbDaysOfStats).first().subscribe(stats => {
      const totalMails = stats.total.domainNotFound + stats.total.found + stats.total.notFound + stats.total.timeOut;
      this.statistics.percentFoundEmails = totalMails ? Math.round(stats.total.found / totalMails * 100) : 'NA';
      this.statistics.percentFoundPros = 'NA';
      this.statistics.percentOkEmails =  stats.total.found ? Math.round((stats.total.confidence['100'] || 0) / stats.total.found * 100) : 'NA';
      this.statistics.percentReceivedEmails = 'NA';
    });
  }

  public getWeek() {
    const now = Date.now();
    this._dateNow = new Date(now);
    this._dashboardService.getNextDateSend(this._dateNow.toString()).first().subscribe( (batches: Array<any>) => {
        this._weekBatches = batches;
    });
  }

  public getNextWeek() {
    this._dateNow.setDate(this._dateNow.getDate() + 7);
    this._dashboardService.getNextDateSend(this._dateNow.toString()).first().subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
    });
  }

  public getLastWeek() {
    this._dateNow.setDate(this._dateNow.getDate() - 7);
    this._dashboardService.getNextDateSend(this._dateNow.toString()).first().subscribe((batches: Array<any>) => {
      this._weekBatches = batches;
    });
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

  public getDateString(d: any): string {
    let result = '';
    let day = d.split('/')[0];
    let month = d.split('/')[1];
    day = ('0' + day).slice(-2);
    month = Number(month);
    month ++;
    month = month.toString();
    month = ('0' + month).slice(-2);
    if (this._translateService.currentLang === 'fr') {
      result = day + '/' + month;
    } else {
      result = month + '/' + day;
    }
    return result;
  }

  showPreview(event: Event, batch: any) {
    event.preventDefault();
    this._selectedBatch = batch;
    this._innovationService.getInnovationCard(batch.innovation.innovationCards[0]).first().subscribe( card => {
      this._selectedInnovation = card;
      this.sidebarTemplateValue = {
        animate_state: this.sidebarTemplateValue.animate_state === 'active' ? 'inactive' : 'active',
        title: 'PROJECT_MODULE.SETUP.PITCH.INNOVATION_PREVIEW',
        size: '726px'
      };
      this._modalSelected = true;
    });
  }

  closeSidebar(value: string) {
    this.sidebarTemplateValue.animate_state = value;
    this._modalSelected = false;
  }

  get refreshNeededEmitter(): Subject<any> {
    return this._refreshNeededEmitter;
  }

  get adminLevel(): number {
    return this._authService.adminLevel;
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

  get modalSelected(): boolean {
    return this._modalSelected;
  }

}
