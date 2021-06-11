import { Component, OnInit } from '@angular/core';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';
import { Table } from '../../../../../table/models/table';
import { Column } from '../../../../../table/models/column';
import { TrackingService } from '../../../../../../services/tracking/tracking.service';

export interface Month {
  name: string;
  shortForm: string;
  number: number;
  days: number;
}

@Component({
  templateUrl: './admin-product-tracking.component.html',
  styleUrls: ['./admin-product-tracking.component.scss']
})

export class AdminProductTrackingComponent implements OnInit {
  private _months: Array<Month> = [
    {
      name: 'January',
      shortForm: 'Jan.',
      number: 1,
      days: 31
    },
    {
      name: 'February',
      shortForm: 'Feb.',
      number: 2,
      days: 28
    },
    {
      name: 'March',
      shortForm: 'Mar.',
      number: 3,
      days: 31
    },
    {
      name: 'April',
      shortForm: 'Apr.',
      number: 4,
      days: 31
    },
    {
      name: 'May',
      shortForm: 'May',
      number: 5,
      days: 31
    },
    {
      name: 'June',
      shortForm: 'Jun.',
      number: 6,
      days: 30
    },
    {
      name: 'July',
      shortForm: 'Jul.',
      number: 7,
      days: 31
    },
    {
      name: 'August',
      shortForm: 'Aug.',
      number: 8,
      days: 31
    },
    {
      name: 'September',
      shortForm: 'Sep.',
      number: 9,
      days: 30
    },
    {
      name: 'October',
      shortForm: 'Oct.',
      number: 10,
      days: 31
    },
    {
      name: 'November',
      shortForm: 'Nov.',
      number: 11,
      days: 30
    },
    {
      name: 'December',
      shortForm: 'Dec.',
      number: 12,
      days: 31
    }
  ];

  public _trackingTable: Table = <Table>{};

  private _monthSelected: Month =
    {
      name: 'January',
      shortForm: 'Jan.',
      number: 1,
      days: 31
    };

  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService) {
  }

  ngOnInit(): void {
  }

  public initTrackingTable(content: Array<any>, total = 0, title: string) {
    this._trackingTable = {
      _selector: 'admin-product-tracking-table',
      _title: title,
      _content: content,
      _total: total,
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

  /**
   * init columns by days of the month
   * @param month
   */
  public initColumnsByMonth(month: Month) {
    const columns: Array<Column> = [];
    [...Array(month.days).keys()].map(day => {
      columns.push({
        _attrs: [(day + 1).toString()],
        _name: (day + 1).toString(),
        _type: 'TEXT',
      });
    });
    return columns;
  }


  public get months(): Array<Month> {
    return this._months;
  }


  public get monthSelected(): Month {
    return this._monthSelected;
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings']);
    }
  }

  public get trackingTable(): Table {
    return this._trackingTable;
  }
}
