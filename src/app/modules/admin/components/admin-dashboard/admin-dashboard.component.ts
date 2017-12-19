import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../services/auth/auth.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public operators = [];
  public operatorId = '';

  public nbDaysOfStats = '';

  public operatorData = {
    nbProjectsToValidate: null,
    nbProjectsToTreat: null
  };

  public statistics = {
    percentFoundedPros: null,
    percentFoundedEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };

  private _refreshNeededEmitter = new Subject<any>();


  constructor(private _titleService: TranslateTitleService,
              private _dashboardService: DashboardService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this._titleService.setTitle('Admin Dashboard');

    if (this._authService.user.isOperator) {
      this.operatorId = this._authService.user._id;
    }

    this._dashboardService.getOperators().subscribe((operators) => this.operators = operators.result);

    this._dashboardService.getOperatorData(this.operatorId).subscribe((operatorData) => this.operatorData = operatorData);

    this._dashboardService.getStatistics().subscribe((globalData) => this.statistics = globalData);
  }

  public newOperatorSelected(event) {
    this.refreshNeededEmitter.next({
      operatorId: event
    });
    this._dashboardService.getOperatorData(this.operatorId).subscribe((operatorData) => this.operatorData = operatorData);
  }

  public newPeriodOfStatsSelected(event) {
    alert('TODO actualiser les données avec la nouvelle période');
  }

  get refreshNeededEmitter(): Subject<any> {
    return this._refreshNeededEmitter;
  }

}
