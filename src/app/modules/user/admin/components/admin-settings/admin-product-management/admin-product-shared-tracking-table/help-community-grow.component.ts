import { Component, Input, OnInit } from '@angular/core';
import { Table } from '../../../../../../table/models/table';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { AdminProductSharedTrackingTableComponent } from './admin-product-shared-tracking-table.component';
import { TranslateNotificationsService } from '../../../../../../../services/notifications/notifications.service';

@Component({
  selector: 'app-help-community',
  templateUrl: './admin-product-shared-tracking-table.component.html',
  styleUrls: ['./admin-product-shared-tracking-table.component.scss']
})

export class HelpCommunityGrowComponent extends AdminProductSharedTrackingTableComponent implements OnInit {
  /**
   * on which page we get the trackers
   * @param value
   */
  @Input() set pageTitle(value: string) {
    this._pageTitle = value;
    this._getTrackers();
  }

  /**
   * value: which link/button
   * @param value
   */
  @Input() set activatedTracking(value: string) {
    this._activatedTab = value;
    this._getTrackers();
  }


  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService,
              protected _translateNotificationsService: TranslateNotificationsService) {
    super(_rolesFrontService, _trackingService, _translateNotificationsService);
    this._selector = 'admin-help-community-grow-tracking-table';
    this._title = '';
    this._columns = [
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
    this._content = [];
    this._trackingTable = <Table>{};
    this._path = ['tracking', 'tipsShare', 'helpCommunity'];
  }

  ngOnInit() {
    this._trackingTable = this.initTrackingTable(this._selector, this._title, this._content, this._columns);
    this._getTrackers();
  }
}
