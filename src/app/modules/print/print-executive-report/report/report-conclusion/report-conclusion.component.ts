import { Component, Inject, Input, OnChanges, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { OldExecutiveReport } from '../../../../../models/innovation';
import { ExecutiveReport } from '../../../../../models/executive-report';
import { User } from '../../../../../models/user.model';
import { UserService } from '../../../../../services/user/user.service';
import { isPlatformBrowser } from '@angular/common';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'report-conclusion',
  templateUrl: './report-conclusion.component.html',
  styleUrls: ['./report-conclusion.component.scss']
})

export class ReportConclusionComponent implements OnChanges {

  @Input() report: OldExecutiveReport | ExecutiveReport = <OldExecutiveReport | ExecutiveReport>{};

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _userService: UserService) { }

  private _sale: User = <User>{};

  private _operator: User = <User>{};

  private _defOperator: User = <User>{
    name: 'Flavien Collard',
    email: 'fcollard@umi.us'
  };

  private _defSale: User = <User>{
    name: 'Aurelien Champagne',
    phone: '+33 (0)6 49 34 41 19',
    email: 'achampagne@umi.us'
  };

  ngOnChanges(): void {
    if (this.report['totalSections'] && !this.report['_id']) {
      this._typeInnovation();
    } else if (this.report['_id']) {
      this._typeExecutive();
    }
  }

  /***
   * it the object type is Innovation.
   * @private
   */
  private _typeInnovation() {
    const data: OldExecutiveReport = <OldExecutiveReport>this.report;
    this._setDefSale();

    if (data.operator && data.operator.id) {
      this._operator = data.operator
    } else {
      this._setDefOp();
    }
  }

  /***
   * if the object type is Executive report
   * @private
   */
  private _typeExecutive() {
    const data: ExecutiveReport = <ExecutiveReport>this.report;

    if (data.operator) {
      this._getUser(data.operator, 'OPERATOR')
    } else {
      this._setDefOp();
    }

    if (data.sale) {
      this._getUser(data.sale, 'SALE')
    } else {
      this._setDefSale();
    }
  }

  private _setDefOp() {
    if (this.isUMI) {
      this._operator = this._defOperator;
    }
  }

  private _setDefSale() {
    if (this.isUMI) {
      this._sale = this._defSale;
    }
  }

  /***
   * based on the id we get the user here its for Operator and Sale
   * @param id
   * @param type
   * @private
   */
  private _getUser(id: string, type: string) {
    if (isPlatformBrowser(this._platformId)) {
      const config: any = {
        fields: 'firstName lastName email phone name',
      };

      this._userService.get(id, config).pipe(first()).subscribe((user) => {
        if (user) {
          if (type === 'OPERATOR') {
            this._operator = user;
          } else if (type === 'SALE') {
            this._sale = user;
          }
        }
      }, (err: HttpErrorResponse) => {
        console.error(err);
      });
    }

  }

  get companyUrl(): string {
    return environment.companyURL && environment.companyURL.slice(8);
  }

  get logo(): string {
    return environment.logoSynthURL;
  }

  get isUMI(): boolean {
    return environment.domain === 'umi'
  }

  get sale(): User {
    return this._sale;
  }

  get operator(): User {
    return this._operator;
  }

}
