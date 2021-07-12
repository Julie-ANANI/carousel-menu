import { Component } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { PresetService } from '../../../../../services/preset/preset.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TemplatesService } from '../../../../../services/templates/templates.service';
import { RolesFrontService } from '../../../../../services/roles/roles-front.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorFrontService } from '../../../../../services/error/error-front.service';

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
  templateUrl: './admin-libraries.component.html',
  styleUrls: ['./admin-libraries.component.scss']
})

export class AdminLibrariesComponent {

  private _tabs: Array<Tab> = [
    {name: 'Workflows', path: 'workflows', link: 'workflows'},
    {name: 'Emails', path: 'emails', link: 'emails'},
    {name: 'Signatures', path: 'signatures', link: 'signatures'},
    {name: 'Use cases', path: 'useCases', link: 'use-cases'}
  ];

  private _options: Array<ActionOption> = [];

  constructor(private _translateTitleService: TranslateTitleService,
              private _router: Router,
              private _translateNotificationsService: TranslateNotificationsService,
              private _presetService: PresetService,
              private _rolesFrontService: RolesFrontService,
              private _templateService: TemplatesService) {

    this.setPageTitle();

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        const url = this._router.routerState.snapshot.url.split('/');
        if (url.length > 4 && url[3] === 'libraries') {
          const tab = this._tabs.find((_tab) => _tab.link === url[4]);
          const name = (tab && tab.name) || url[4];
          this.setPageTitle(name);
          this._setOptions(name.toLowerCase());
        }
      }
    });
  }

  public setPageTitle(title?: string) {
    if (title) {
      this._translateTitleService.setTitle( title.slice(0, 1).toUpperCase() + title.slice(1) + ' | Libraries');
    } else {
      this._translateTitleService.setTitle('Libraries');
    }
  }

  /**
   * for the moment commenting the functionality of importing the preset.
   * on 2 July, 2021
   * @param page
   * @private
   */
  private _setOptions(page: string) {
    switch (page) {

      case 'questionnaire':
        this._options = [
          /*{ functionality: 'IMPORT', optionName: 'Import questionnaire', activePage: 'questionnaire' },*/
          { functionality: 'EXPORT', optionName: 'Export questionnaires', activePage: 'questionnaire' },
          ];
        break;

      case 'workflows':
        this._options = [
          { functionality: 'IMPORT', optionName: 'Import workflow', activePage: 'workflows' },
          { functionality: 'EXPORT', optionName: 'Export workflows', activePage: 'workflows' }
          ];
        break;

      default:
        this._options = [];
        break;

    }
  }

  public canAccess(path?: Array<string>) {
    if (path) {
      return this._rolesFrontService.hasAccessAdminSide(['libraries'].concat(path));
    } else {
      return this._rolesFrontService.hasAccessAdminSide(['libraries']);
    }
  }

  private _importPreset(file: File) {
    this._presetService.import(file).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The CSV has been imported.');
      this._translateNotificationsService.success('Success',
        'The page is going to reload automatically in few seconds. Thank you for your patience.');
      setTimeout(() => {
        document.location.reload();
      }, 5000);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  private _importWorkflow(file: File) {
    this._templateService.import(file).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('Success', 'The CSV has been imported.');
      this._translateNotificationsService.success('Success',
        'The page is going to reload automatically in few seconds. Thank you for your patience.');
      setTimeout(() => {
        document.location.reload();
      }, 5000);
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorMessage(err.status));
      console.error(err);
    });
  }

  public onClickImport(file: File, option: ActionOption) {
    switch (option.activePage) {

      case 'questionnaire':
        this._importPreset(file);
        break;

      case 'workflows':
        this._importWorkflow(file);
        break;

    }
  }

  public onClickExport(event: Event, option: ActionOption) {
    event.preventDefault();

    switch (option.activePage) {

      case 'questionnaire':
        window.open(PresetService.export());
        break;

      case 'workflows':
        window.open(TemplatesService.export());
        break;

    }

  }

  get isTech(): boolean {
    return this._rolesFrontService.isTechRole();
  }

  get tabs(): Array<Tab> {
    return this._tabs;
  }

  get options(): Array<ActionOption> {
    return this._options;
  }

}
