import { Component, OnInit } from '@angular/core';
import { AdminProductTrackingComponent } from '../admin-product-tracking.component';
import { Table } from '../../../../../../table/models/table';
import { Column } from '../../../../../../table/models/column';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { Config } from '../../../../../../../models/config';

@Component({
  selector: 'app-use-super-tools',
  templateUrl: './use-super-tools.component.html',
  styleUrls: ['./use-super-tools.component.scss']
})

export class UseSuperToolsComponent extends AdminProductTrackingComponent implements OnInit {
  private _monthSelectedSub: number = this.months[0];

  private _yearSelectedSub: number = this.years[0];

  private _table: Table = <Table>{};

  private _columns: Array<Column> =
    [
      {
        _attrs: ['day'],
        _name: 'Day',
        _type: 'NUMBER',
      },
      {
        _attrs: ['click'],
        _name: 'Nb click',
        _type: 'NUMBER',
      },
      {
        _attrs: ['connection'],
        _name: 'Connection',
        _type: 'NUMBER',
      }
    ];

  private _content: Array<any> = [];
  private _queryConfig: Config = <Config>{
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}',
  };


  constructor(protected _rolesFrontService: RolesFrontService, protected _trackingService: TrackingService) {
    super(_rolesFrontService, _trackingService);
  }

  ngOnInit() {
    this._table = this.initTrackingTable('admin-use-super-tools', 'Use super tool', false, this._content, this._columns);
  }

  get monthSelectedSub(): number {
    return this._monthSelectedSub;
  }

  set monthSelectedSub(value: number) {
    this._monthSelectedSub = value;
  }


  get yearSelectedSub(): number {
    return this._yearSelectedSub;
  }

  set yearSelectedSub(value: number) {
    this._yearSelectedSub = value;
  }


  get table(): Table {
    return this._table;
  }

  get queryConfig(): Config {
    return this._queryConfig;
  }

  set queryConfig(value: Config) {
    this._queryConfig = value;
  }
}
