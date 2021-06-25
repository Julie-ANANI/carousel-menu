import { Component } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';

@Component({
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})

export class AdminSettingsComponent {

  private _tabs: Array<string> = ['blocklist', 'countries', 'enterprises', 'tracking'];

  constructor(private _translateTitleService: TranslateTitleService,
              private _router: Router,
              private _rolesFrontService: RolesFrontService) {

    this.setPageTitle();

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        const url = this._router.routerState.snapshot.url.split('/');
        if (url.length > 4 && url[3] === 'settings') {
          this.setPageTitle(url[4]);
        }
      }
    });

  }

  public setPageTitle(title?: string) {
    if (title) {
      this._translateTitleService.setTitle(title.slice(0, 1).toUpperCase() + title.slice(1) + ' | Settings');
    } else {
      this._translateTitleService.setTitle('Settings');
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['settings'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['settings']);
    }
  }

  get tabs(): Array<string> {
    return this._tabs;
  }

}
