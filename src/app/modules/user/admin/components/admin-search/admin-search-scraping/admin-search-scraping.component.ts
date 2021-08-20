import {Component} from '@angular/core';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';

@Component({
  selector: 'app-admin-search-scraping',
  templateUrl: './admin-search-scraping.component.html',
  styleUrls: ['./admin-search-scraping.component.scss']
})
export class AdminSearchScrapingComponent {

  private _accessPath: Array<string> = ['search', 'scraping'];

  constructor(private _rolesFrontService: RolesFrontService) { }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(this._accessPath);
  }

  get accessPath(): Array<string> {
    return this._accessPath;
  }

}

