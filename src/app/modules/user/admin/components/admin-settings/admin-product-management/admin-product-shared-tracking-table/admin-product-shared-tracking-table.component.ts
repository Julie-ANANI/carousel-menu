import { Component, OnInit } from '@angular/core';
import { Table } from '../../../../../../table/models/table';
import { Column } from '../../../../../../table/models/column';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { Config } from '../../../../../../../models/config';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  templateUrl: './admin-product-shared-tracking-table.component.html',
  styleUrls: ['./admin-product-shared-tracking-table.component.scss']
})

export class AdminProductSharedTrackingTableComponent implements OnInit {
  protected _months: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  protected _years: Array<number> = [];

  protected _monthSelected: number;

  protected _yearSelected: number;

  protected _trackingTable: Table = <Table>{};

  protected _columns: Array<Column> = [];

  protected _content: Array<any> = [];

  protected _queryConfig: Config = <Config>{
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}',
  };

  protected _selector = '';

  protected _title = '';

  protected _pageTitle = '';

  protected _activatedTab = '';

  constructor(protected _rolesFrontService: RolesFrontService, protected _trackingService: TrackingService) {
    this._generateYears();
    this._monthSelected = this.months[0];
    this._yearSelected = this.years[0];
  }

  ngOnInit() {
  }

  private _generateYears() {
    this._years = [];
    for (let i = new Date().getFullYear(); i >= 2018; i--) {
      this._years.push(i);
    }
  }

  public initTrackingTable(_selector: string, _title: string, _content: Array<any>, _columns: Array<Column>): Table {
    return {
      _selector: _selector,
      _title: _title,
      _content: _content,
      _total: _content.length,
      _isTitle: false,
      _columns: _columns
    };
  }

  protected _getTrackers() {
    this._trackingTable._total = -1;
    this._trackingService.getTrackers(this._monthSelected.toString(), this._yearSelected.toString(), this._pageTitle, this._activatedTab)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this._content = data.data;
          this._trackingTable = this.initTrackingTable(this._selector, this._title, this._content, this._columns);
        } else {
          this._trackingTable._total = 0;
        }
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this._trackingTable._total = 0;
      });
  }


  get monthSelected(): number {
    return this._monthSelected;
  }

  set monthSelected(value: number) {
    this._monthSelected = value;
    this._getTrackers();
  }


  get yearSelected(): number {
    return this._yearSelected;
  }

  set yearSelected(value: number) {
    this._yearSelected = value;
    this._getTrackers();
  }


  get trackingTable(): Table {
    return this._trackingTable;
  }

  get queryConfig(): Config {
    return this._queryConfig;
  }

  set queryConfig(value: Config) {
    this._queryConfig = value;
  }


  get months(): Array<number> {
    return this._months;
  }

  get years(): Array<number> {
    return this._years;
  }
}
