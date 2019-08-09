import { Component } from '@angular/core';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { NavigationCancel, NavigationEnd, Router } from '@angular/router';
import { PresetService } from '../../../../../services/preset/preset.service';
import { first } from 'rxjs/operators';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TemplatesService } from '../../../../../services/templates/templates.service';

interface ActionOption {
  functionality: string;
  optionName: string;
  activePage: string;
}

@Component({
  selector: 'app-admin-libraries',
  templateUrl: './admin-libraries.component.html',
  styleUrls: ['./admin-libraries.component.scss']
})

export class AdminLibrariesComponent {

  private _tabs: Array<string> = ['workflows', 'emails', 'questionnaire', 'signatures'];

  private _options: Array<ActionOption> = [];

  constructor(private _translateTitleService: TranslateTitleService,
              private _router: Router,
              private _translateNotificationsService: TranslateNotificationsService,
              private _presetService: PresetService,
              private _templateService: TemplatesService) {

    this._translateTitleService.setTitle('Libraries');

    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
        const url = this._router.routerState.snapshot.url.split('/');
        if (url.length > 4 && url[3] === 'libraries') {
          this._setOptions(url[4]);
        }
      }
    });

  }

  private _setOptions(page: string) {
    switch (page) {

      case 'questionnaire':
        this._options = [
          { functionality: 'import', optionName: 'COMMON.BUTTON.IMPORT_QUESTIONNAIRE', activePage: 'questionnaire' },
          { functionality: 'export', optionName: 'COMMON.BUTTON.EXPORT_QUESTIONNAIRE', activePage: 'questionnaire' },
          ];
        break;

      case 'workflows':
        this._options = [
          { functionality: 'import', optionName: 'COMMON.BUTTON.IMPORT_WORKFLOW', activePage: 'workflows' },
          { functionality: 'export', optionName: 'COMMON.BUTTON.EXPORT_WORKFLOW', activePage: 'workflows' }
          ];
        break;

      default:
        this._options = [];
        break;

    }
  }

  private _importPreset(file: File) {
    this._presetService.import(file).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.IMPORT.CSV');
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.RELOADING_PAGE');
      setTimeout(() => {
        document.location.reload();
      }, 5000);
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
    });
  }

  private _importWorkflow(file: File) {
    this._templateService.import(file).pipe(first()).subscribe(() => {
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.IMPORT.CSV');
      this._translateNotificationsService.success('ERROR.SUCCESS', 'ERROR.RELOADING_PAGE');
      setTimeout(() => {
        document.location.reload();
      }, 5000);
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.OPERATION_ERROR');
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

  get tabs(): Array<string> {
    return this._tabs;
  }

  get options(): Array<ActionOption> {
    return this._options;
  }

}
