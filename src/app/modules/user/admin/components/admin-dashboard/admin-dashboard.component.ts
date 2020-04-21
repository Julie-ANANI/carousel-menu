import { Component, OnInit } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { DashboardService } from '../../../../../services/dashboard/dashboard.service';
import { AuthService } from '../../../../../services/auth/auth.service';
import { User } from '../../../../../models/user.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})

export class AdminDashboardComponent implements OnInit {

  private _spinnerDisplay = true;

  public operators: Array<User> = [];

  public operatorId = '';

  operatorData: {
    nbProjectsToValidate: number,
    nbProjectsToTreat: number
  } = {
    nbProjectsToValidate: null,
    nbProjectsToTreat: null
  };

  private _refreshNeededEmitter = new Subject<any>();

  constructor(private translateTitleService: TranslateTitleService,
              private dashboardService: DashboardService,
              private authService: AuthService) { }

  ngOnInit() {

    this.translateTitleService.setTitle('Dashboard');

    if (this.authService.user && this.authService.user.isOperator) {
      this.operatorId = this.authService.user.id;
    }

    this.dashboardService.getOperators().subscribe((operators: any) => {
      this.operators = operators.result
        .filter((value: any) => {
          return this.authService.adminLevel> 2 || (this.authService.user && this.authService.user.isOperator
                                                    && value._id === this.authService.user.id);
        })
        .sort((a: User, b: User) => {
        return a.firstName > b.firstName ? 1 : -1;
      });
    });

    if(!this.operatorId && this.authService.adminLevel> 2) {
      this.dashboardService
        .getOperatorData(this.operatorId)
        .subscribe((operatorData: any) => this.operatorData = operatorData);
    }

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

  get refreshNeededEmitter(): Subject<any> {
    return this._refreshNeededEmitter;
  }

  get adminLevel(): number {
    return this.authService.adminLevel;
  }

  get spinnerDisplay(): boolean {
    return this._spinnerDisplay;
  }

}
