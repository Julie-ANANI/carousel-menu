import { Component, OnInit } from '@angular/core';
import { AdminProductTrackingComponent, Month } from '../admin-product-tracking.component';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { Config } from '../../../../../../../models/config';

@Component({
  selector: 'app-product-subscription-tracking',
  templateUrl: './admin-product-subscription-tracking.component.html',
  styleUrls: ['./admin-product-subscription-tracking.component.scss']
})

export class AdminProductSubscriptionTrackingComponent extends AdminProductTrackingComponent implements OnInit {
  private _queryConfig: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}',
  };

  private _contents: Array<any> = [];

  private _monthSelectedSub: Month =
    {
      name: 'January',
      shortForm: 'Jan.',
      number: 1,
      days: 31
    };

  constructor(protected _rolesFrontService: RolesFrontService) {
    super(_rolesFrontService);
  }

  ngOnInit(): void {
    this._testContent();
    this.initTrackingTable(this._contents, this._contents.length, 'Subscription');
  }

  private _testContent() {
    for (let i = 1; i < 8; i++) {
      this._contents.push({day: i, mean: 'Mean' + i, sd: 'SD' + i, min: 'MIN' + i, max: 'MAX' + i});
    }
  }

  get queryConfig(): Config {
    return this._queryConfig;
  }

  set queryConfig(value: Config) {
    this._queryConfig = value;
  }


  get monthSelectedSub(): Month {
    return this._monthSelectedSub;
  }

  set monthSelectedSub(value: Month) {
    this._monthSelectedSub = value;
  }
}
