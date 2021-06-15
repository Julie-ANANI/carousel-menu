import { Component, Input, OnInit } from '@angular/core';
import { AdminProductTrackingComponent } from '../admin-product-tracking.component';
import { Table } from '../../../../../../table/models/table';
import { Column } from '../../../../../../table/models/column';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { Config } from '../../../../../../../models/config';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-help-community',
  templateUrl: './help-community-grow.component.html',
  styleUrls: ['./help-community-grow.component.scss']
})

export class HelpCommunityGrowComponent extends AdminProductTrackingComponent implements OnInit {
  @Input() set pageTitle(value: string) {
    this._pageTitle = value;
    this._getTrackers();
  }

  @Input() set activatedTracking(value: string) {
    this._activatedTracking = value;
    this._getTrackers();
  }

  private _monthSelectedSub: number = this.months[0];

  private _pageTitle = '';

  private _activatedTracking = '';

  private _yearSelectedSub: number = this.years[0];

  private _helpCommunityTable: Table = <Table>{};

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
        _attrs: ['view'],
        _name: 'Nb view',
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
    this._helpCommunityTable = this.initTrackingTable('admin-help-community-grow-tracking', '', false, this._content, this._columns);
  }

  get monthSelectedSub(): number {
    return this._monthSelectedSub;
  }

  set monthSelectedSub(value: number) {
    this._monthSelectedSub = value;
    this._getTrackers();
  }


  get yearSelectedSub(): number {
    return this._yearSelectedSub;
  }

  set yearSelectedSub(value: number) {
    this._yearSelectedSub = value;
    this._getTrackers();
  }


  get helpCommunityTable(): Table {
    return this._helpCommunityTable;
  }


  get queryConfig(): Config {
    return this._queryConfig;
  }

  set queryConfig(value: Config) {
    this._queryConfig = value;
  }

  private _getTrackers() {
    this._helpCommunityTable._total = -1;
    this._trackingService.getTrackers(this._monthSelectedSub.toString(), this._yearSelectedSub.toString(), this._pageTitle, this._activatedTracking)
      .pipe(first())
      .subscribe((data: any) => {
        if (data) {
          this._content = data.data;
          this._helpCommunityTable = this.initTrackingTable('admin-help-community-grow-tracking', '', false, this._content, this._columns);
        } else {
          this._helpCommunityTable._total = 0;
        }
      }, (err: HttpErrorResponse) => {
        console.log(err);
        this._helpCommunityTable._total = 0;
      });
  }
}
