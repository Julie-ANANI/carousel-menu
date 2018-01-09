import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { SearchService } from '../../../../services/search/search.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public operators = [];
  public operatorId = '';

  public nbDaysOfStats = 1;

  public operatorData = {
    nbProjectsToValidate: null,
    nbProjectsToTreat: null
  };

  public statistics = {
    percentFoundPros: null,
    percentFoundEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };

  private _refreshNeededEmitter = new Subject<any>();

  constructor(private _titleService: TranslateTitleService,
              private _dashboardService: DashboardService,
              private _searchService: SearchService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this._titleService.setTitle('Admin Dashboard');

    if (this._authService.user.isOperator) {
      this.operatorId = this._authService.user._id;
    }

    this._dashboardService.getOperators().subscribe((operators) => this.operators = operators.result);

    this._dashboardService.getOperatorData(this.operatorId).subscribe((operatorData) => this.operatorData = operatorData);

    this.getPeriodStats();
  }

  public newOperatorSelected(event) {
    this.refreshNeededEmitter.next({
      operatorId: event
    });
    this._dashboardService.getOperatorData(this.operatorId).subscribe((operatorData) => this.operatorData = operatorData);
  }

  public getPeriodStats() {
    this._searchService.getEmailStats(this.nbDaysOfStats).subscribe(stats => {
      const totalMails = stats.total.domainNotFound + stats.total.found + stats.total.notFound + stats.total.timeOut;
      this.statistics.percentFoundEmails = totalMails ? Math.round(stats.total.found / totalMails * 100) : 'NA';
      this.statistics.percentFoundPros = 'XX';
      this.statistics.percentOkEmails =  stats.total.found ? Math.round((stats.total.confidence['100'] || 0) / stats.total.found * 100) : 'NA';
      this.statistics.percentReceivedEmails = 'XX';
    });
  }

  get refreshNeededEmitter(): Subject<any> {
    return this._refreshNeededEmitter;
  }

  get adminLevel(): number {
    return this._authService.adminLevel;
  }
}
