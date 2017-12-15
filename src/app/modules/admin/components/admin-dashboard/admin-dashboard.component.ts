import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../services/title/title.service';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public operators = [];
  public operatorId = '';
  public nbDaysOfStats = '30';

  public operatorData = {
    nbProjectsToValidate: null,
    nbProjectsToTreat: null,
    nbProjectsToFind: null
  };

  public statistics = {
    percentFoundedPros: null,
    percentFoundedEmails: null,
    percentOkEmails: null,
    percentReceivedEmails: null
  };


  public projects = {
    preparation: {
      total: null,
      list: []
    },
    launched: {
      total: null,
      list: []
    },
    finished: {
      total: null,
      list: []
    }
  };

  constructor(private _titleService: TranslateTitleService,
              private _dashboardService: DashboardService,
              private _authService: AuthService) { }

  ngOnInit(): void {
    this._titleService.setTitle('Admin Dashboard');
    if (this._authService.user.isOperator) {
      this.operatorId = this._authService.user._id;
    }

    this._dashboardService.getOperators().subscribe((operators) =>
      this.operators = operators.result
    );
    this._dashboardService.getOperatorData().subscribe((operatorData) =>
      this.operatorData = operatorData);
    this._dashboardService.getStatistics().subscribe((globalData) => this.statistics = globalData);
  }

  public newOperatorSelected(event) {
    alert('TODO actualiser les données avec le nouvel opérateur');
  }

  public newPeriodOfStatsSelected(event) {
    alert('TODO actualiser les données avec la nouvelle période');
  }

}
