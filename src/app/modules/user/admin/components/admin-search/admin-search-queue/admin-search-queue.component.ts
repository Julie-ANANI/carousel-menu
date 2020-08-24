import {Component} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-search-queue.component.html',
  styleUrls: ['./admin-search-queue.component.scss']
})

export class AdminSearchQueueComponent {

  private _accessPath: Array<string> = ['search', 'queue'];

  constructor(private _rolesFrontService: RolesFrontService) { }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
