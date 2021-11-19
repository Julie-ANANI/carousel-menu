import {Component} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  template: `
    <div
      *ngIf="canAccess()"
      class="container fluid grid-2xl p-top-30 p-bottom-30 animate-fade is-5"
      id="admin-search-pros">
      <div class="column col-sm-12 col-11 col-mx-auto">
        <app-shared-search-pros [accessPath]="accessPath"></app-shared-search-pros>
      </div>
    </div>
  `,
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
