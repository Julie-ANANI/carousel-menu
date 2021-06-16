import { Component, OnInit } from '@angular/core';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { first } from 'rxjs/operators';
import { Table } from '../../../../../../table/models/table';
import { AdminProductSharedTrackingTableComponent } from './admin-product-shared-tracking-table.component';

@Component({
  selector: 'app-product-subscription-tracking',
  templateUrl: './admin-product-shared-tracking-table.component.html',
  styleUrls: ['./admin-product-shared-tracking-table.component.scss']
})

export class AdminProductSubscriptionTrackingComponent extends AdminProductSharedTrackingTableComponent implements OnInit {

  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService) {
    super(_rolesFrontService, _trackingService);
    this._selector = 'admin-product-tracking-table';
    this._title = 'Subscription tracking';
    this._columns = [
      {
        _attrs: ['day'],
        _name: 'Day',
        _type: 'NUMBER',
      },
      {
        _attrs: ['mean'],
        _name: 'Mean / ms',
        _type: 'NUMBER',
      },
      {
        _attrs: ['sd'],
        _name: 'SD / ms',
        _type: 'NUMBER',
      },
      {
        _attrs: ['min'],
        _name: 'MIN / ms',
        _type: 'NUMBER',
      },
      {
        _attrs: ['max'],
        _name: 'MAX / ms',
        _type: 'NUMBER',
      },
      {
        _attrs: ['total'],
        _name: 'Total',
        _type: 'NUMBER',
      }
    ];
    this._content = [];
    this._trackingTable = <Table>{};
    this._path = ['tracking', 'subscription'];
  }

  ngOnInit(): void {
    this._trackingTable = this.initTrackingTable(this._selector, this._title, this._content, this._columns);
    this._getTrackers();
  }

  /**
   * override _getTrackers in parent class
   * get subscription's timelines
   * @protected
   */
  protected _getTrackers() {
    this._trackingTable._total = -1;
    this._trackingService.getSubscriptionTrackingTimelines(this._monthSelected.toString(), this._yearSelected.toString()).pipe(first())
      .subscribe(res => {
        if (res) {
          this._content = res.data;
          this._trackingTable = this.initTrackingTable(this._selector, this._title, this._content, this._columns);
        } else {
          this._trackingTable._total = 0;
        }
      }, err => {
        console.log(err);
        this._trackingTable._total = -1;
      });
  }
}
