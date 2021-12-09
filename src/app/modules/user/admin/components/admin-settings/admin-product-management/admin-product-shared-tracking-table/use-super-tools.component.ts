import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Table } from '@umius/umi-common-component/models';
import { RolesFrontService } from '../../../../../../../services/roles/roles-front.service';
import { TrackingService } from '../../../../../../../services/tracking/tracking.service';
import { AdminProductSharedTrackingTableComponent } from './admin-product-shared-tracking-table.component';
import { TranslateNotificationsService } from '../../../../../../../services/translate-notifications/translate-notifications.service';

@Component({
  selector: 'app-use-super-tools',
  templateUrl: './admin-product-shared-tracking-table.component.html',
  styleUrls: ['./admin-product-shared-tracking-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class UseSuperToolsComponent extends AdminProductSharedTrackingTableComponent implements OnInit {

  constructor(protected _rolesFrontService: RolesFrontService,
              protected _trackingService: TrackingService,
              protected changeDetectorRef: ChangeDetectorRef,
              protected _translateNotificationsService: TranslateNotificationsService) {
    super(_rolesFrontService, _trackingService, changeDetectorRef, _translateNotificationsService);
    this.changeDetectorRef.detach();
    this._selector = 'admin-use-super-tools-table';
    this._title = 'Use super tool';
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
        _attrs: ['connection'],
        _name: 'Connection',
        _type: 'NUMBER',
      }
    ];
    this._content = [];
    this._trackingTable = <Table>{};
    this._pageTitle = 'link';
    this._activatedTab = 'user-super-tool';
    this._path = ['tracking', 'tipsShow', 'useSuperTool'];
  }

  ngOnInit() {
    this._trackingTable = this.initTrackingTable(this._selector, this._title, this._content, this._columns);
    this._getTrackers();
  }

}
