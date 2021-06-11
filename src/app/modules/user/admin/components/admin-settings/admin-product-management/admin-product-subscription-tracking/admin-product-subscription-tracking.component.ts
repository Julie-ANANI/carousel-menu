import { Component, OnInit } from '@angular/core';
import { AdminProductTrackingComponent, Month } from '../admin-product-tracking.component';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { Config } from '../../../../../../../models/config';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { first } from 'rxjs/operators';
import { Table } from '../../../../../../table/models/table';

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

  private _isLoading = false;

  private _monthSelectedSub: Month = this.months[0];

  private _trackingTable: Table = <Table>{};


  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService) {
    super(_rolesFrontService, _trackingService);
  }

  ngOnInit(): void {
    this.initTrackingTable(this._contents);
    this._getSubscriptionTrackingTimelines(this._monthSelectedSub);
  }

  public initTrackingTable(content: Array<any>) {
    this._trackingTable = {
      _selector: 'admin-product-tracking-table',
      _title: 'Subscription tracking',
      _content: content,
      _total: content.length,
      _isTitle: true,
      _columns:
        [
          {
            _attrs: ['day'],
            _name: 'Day',
            _type: 'NUMBER',
          },
          {
            _attrs: ['mean'],
            _name: 'Mean',
            _type: 'TEXT',
          },
          {
            _attrs: ['sd'],
            _name: 'SD',
            _type: 'TEXT',
          },
          {
            _attrs: ['min'],
            _name: 'MIN',
            _type: 'TEXT',
          },
          {
            _attrs: ['max'],
            _name: 'MAX',
            _type: 'TEXT',
          },
          {
            _attrs: ['total'],
            _name: 'Total',
            _type: 'TEXT',
          }
        ]
    };
  }

  _getSubscriptionTrackingTimelines(month: Month) {
    this._trackingTable._total = -1;
    this._trackingService.getSubscriptionTrackingTimelines(month.number.toString()).pipe(first()).subscribe(res => {
      if (res) {
        this._contents = res.data.data;
        this.initTrackingTable(this._contents);
        this._isLoading = false;
      }
    });
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


  get trackingTable(): Table {
    return this._trackingTable;
  }

  set monthSelectedSub(value: Month) {
    this._monthSelectedSub = value;
    this._getSubscriptionTrackingTimelines(this._monthSelectedSub);
  }


  get isLoading(): boolean {
    return this._isLoading;
  }
}
