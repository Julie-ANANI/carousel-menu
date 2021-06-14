import { Component, OnInit } from '@angular/core';
import { AdminProductTrackingComponent } from '../admin-product-tracking.component';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { Config } from '../../../../../../../models/config';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { first } from 'rxjs/operators';
import { Table } from '../../../../../../table/models/table';
import { Column } from '../../../../../../table/models/column';

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

  private _monthSelectedSub: number = this.months[0];

  private _yearSelectedSub: number = this.years[0];

  private _trackingTable: Table = <Table>{};

  private _columns: Array<Column> = [
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
  ];


  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService) {
    super(_rolesFrontService, _trackingService);
    this._tableSelector = 'admin-product-tracking-table';
    this._tableTitle = 'Subscription tracking';

  }

  ngOnInit(): void {
    this._trackingTable = this.initTrackingTable(this._tableSelector, this._tableTitle, this._contents, this._columns);
    this._getSubscriptionTrackingTimelines(this._monthSelectedSub, this._yearSelectedSub.toString());
  }

  _getSubscriptionTrackingTimelines(month: number, year: string) {
    this._trackingTable._total = -1;
    this._trackingService.getSubscriptionTrackingTimelines(month.toString(), this._yearSelectedSub.toString()).pipe(first())
      .subscribe(res => {
        if (res) {
          this._contents = res.data.data;
          this._trackingTable = this.initTrackingTable(this._tableSelector, this._tableTitle, this._contents, this._columns);
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


  get monthSelectedSub(): number {
    return this._monthSelectedSub;
  }


  get trackingTable(): Table {
    return this._trackingTable;
  }

  set monthSelectedSub(value: number) {
    this._monthSelectedSub = value;
    this._getSubscriptionTrackingTimelines(this._monthSelectedSub, this._yearSelectedSub.toString());
  }

  get isLoading(): boolean {
    return this._isLoading;
  }


  get yearSelectedSub(): number {
    return this._yearSelectedSub;
  }

  set yearSelectedSub(value: number) {
    this._yearSelectedSub = value;
    this._getSubscriptionTrackingTimelines(this._monthSelectedSub, this._yearSelectedSub.toString());
  }
}
