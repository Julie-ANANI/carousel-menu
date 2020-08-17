import {Component} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-search-history.component.html',
  styleUrls: ['./admin-search-history.component.scss']
})

export class AdminSearchHistoryComponent {

  private _accessPath: Array<string> = ['search', 'history'];

  constructor(private _rolesFrontService: RolesFrontService) { }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
