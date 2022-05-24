import {TranslateTitleService} from '../../../../../services/title/title.service';
import {RolesFrontService} from '../../../../../services/roles/roles-front.service';
import {NavigationCancel, NavigationEnd, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';

interface ActionOption {
  functionality: string;
  optionName: string;
  activePage: string;
}

interface Tab {
  name: string;
  path: string;
  link: string;
}

@Component({
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent implements OnInit {

  private _tabs: Array<Tab> = [
    {name: 'Professionals database', path: 'list', link: 'list'},
    {name: 'Professionals statistics', path: 'statistics', link: 'statistics'}
  ];

  private _options: Array<ActionOption> = [];


  constructor(private _translateTitleService: TranslateTitleService,
              private _router: Router,
              private _rolesFrontService: RolesFrontService) {
    this.setPageTitle();
  }

  ngOnInit(): void {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        const url = this._router.routerState.snapshot.url.split('/');
        if (url.length > 4 && url[3] === 'professionals') {
          const tab = this._tabs.find((_tab) => _tab.link === url[4]);
          const name = (tab && tab.name) || url[4];
          this.setPageTitle(name);
        }
      }
    });
  }

  public setPageTitle(title?: string) {
    if (title) {
      this._translateTitleService.setTitle(title.slice(0, 1).toUpperCase() + title.slice(1) + ' | Professionals');
    } else {
      this._translateTitleService.setTitle('Professionals');
    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['professionals'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['professionals']);
    }
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get options(): Array<ActionOption> {
    return this._options;
  }


}
