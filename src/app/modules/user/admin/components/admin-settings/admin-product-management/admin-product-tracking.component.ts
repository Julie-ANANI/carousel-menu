import { Component, OnInit } from '@angular/core';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { Column } from '../../../../../table/models/column';
import { TrackingService } from '../../../../../../services/tracking/tracking.service';
import { Table } from '../../../../../table/models/table';

@Component({
  templateUrl: './admin-product-tracking.component.html',
  styleUrls: ['./admin-product-tracking.component.scss']
})

export class AdminProductTrackingComponent implements OnInit {
  private _months: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  private _years: Array<number> = [];

  protected _tableSelector = '';

  protected _tableTitle = '';

  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService) {
    this._generateYears();
  }

  ngOnInit(): void {
  }

  private _generateYears() {
    this._years = [];
    for (let i = new Date().getFullYear(); i >= 2018; i--) {
      this._years.push(i);
    }
  }

  /**
   *
   * @param selector
   * @param title
   * @param content
   * @param columns
   */
  public initTrackingTable(selector: string, title: string, content: Array<any>, columns: Array<Column>): Table {
    return {
      _selector: selector,
      _title: title,
      _content: content,
      _total: content.length,
      _isTitle: true,
      _columns: columns
    };
  }


  get years(): Array<number> {
    return this._years;
  }

  public get months(): Array<number> {
    return this._months;
  }


  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings']);
    }
  }
}
