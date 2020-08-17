import {Component} from '@angular/core';
import {TranslateTitleService} from '../../../../../services/title/title.service';
import {Router} from '@angular/router';
import {RolesFrontService} from '../../../../../services/roles/roles-front.service';

@Component({
  moduleId: module.id,
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss']
})

export class AdminSearchComponent {

  private _tabs: Array<{key: string, name: string, route: string}> = [
    {key: 'pros', name: 'Professionals', route: 'pros'},
    {key: 'history', name: 'History', route: 'history'},
    {key: 'waitingLine', name: 'File d\'attente', route: 'queue'}
  ];

  private _heading = '';

  constructor(private _translateTitleService: TranslateTitleService,
              private _rolesFrontService: RolesFrontService,
              private _router: Router) {

    this._initHeading();
    this._setPageTitle();
  }

  private _setPageTitle() {
    this._translateTitleService.setTitle(this._heading +  ' | Search');
  }

  private _initHeading() {
    const _url = this._router.routerState.snapshot.url.split('/');
    if (_url.length > 4) {
      const _params = _url[4].indexOf('?');
      const _value = _params > 0 ? _url[4].substring(0, _params) : _url[4];
      this._heading = AdminSearchComponent._initHeading(_value);
    }
  }

  private static _initHeading(value: string): string {
    switch (value) {

      case 'history':
        return 'Search';

      case 'pros':
        return 'Insights';

      case 'queue':
        return 'Queue';

    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['search'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['search']);
    }
  }

  public onClickTab(event: Event, key: string) {
    event.preventDefault();
    this._heading = AdminSearchComponent._initHeading(key);
    this._setPageTitle();
  }

  get tabs(): Array<{key: string, name: string, route: string}> {
    return this._tabs;
  }

  get heading(): string {
    return this._heading;
  }

}
