import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SearchService } from '../../../../services/search/search.service';
import { User } from '../../../../models/user.model';
import { Subject } from 'rxjs/Subject';
import {Template} from '../../../shared/components/shared-sidebar/interfaces/template';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import {InnovCard} from '../../../../models/innov-card';


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
              private _innovationService: InnovationService) { }

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


  showPreview(event: Event, batch: any) {
    event.preventDefault();
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

  get modalSelected(): boolean {
    return this._modalSelected;
  }
}
