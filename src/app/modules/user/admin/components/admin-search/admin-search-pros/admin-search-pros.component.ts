import {Component} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-search-pros.component.html',
  styleUrls: ['./admin-search-pros.component.scss']
})

export class AdminSearchProsComponent {

  private _accessPath: Array<string> = ['search', 'pros'];

  constructor(private _rolesFrontService: RolesFrontService) { }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}
