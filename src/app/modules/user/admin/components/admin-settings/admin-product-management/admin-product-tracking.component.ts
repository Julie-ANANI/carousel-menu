import { Component } from '@angular/core';
import { RolesFrontService } from '../../../../../../services/roles/roles-front.service';

interface Month {
  name: string;
  shortForm: string;
  number: number;
  days: number;
}

@Component({
  templateUrl: './admin-product-tracking.component.html',
  styleUrls: ['./admin-product-tracking.component.scss']
})

export class AdminProductTrackingComponent {
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

  private _monthSelected = 'Select a month';

  constructor(private _rolesFrontService: RolesFrontService) {
  }


  get months(): Array<Month> {
    return this._months;
  }


  get monthSelected(): string {
    return this._monthSelected;
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings']);
    }
  }

  getMonth(month: Month) {
    this._monthSelected = month.name;
  }
}
