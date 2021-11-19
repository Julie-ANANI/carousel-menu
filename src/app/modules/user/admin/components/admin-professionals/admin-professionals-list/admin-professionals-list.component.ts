import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import { Config } from '@umius/umi-common-component/models';
import {Professional} from '../../../../../../models/professional';
import {TranslateNotificationsService} from '../../../../../../services/notifications/notifications.service';
import {TranslateTitleService} from '../../../../../../services/title/title.service';
import {ProfessionalsService} from '../../../../../../services/professionals/professionals.service';
import {first} from 'rxjs/operators';
import {Response} from '../../../../../../models/response';
import {isPlatformBrowser} from '@angular/common';
import {ConfigService} from '@umius/umi-common-component/services/config';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  templateUrl: './admin-professionals-list.component.html',
})

export class AdminProfessionalsListComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _professionalsService: ProfessionalsService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('Professionals');

  }

  private _professionals: Array<SelectedProfessional> = [];

  get professionals(): Array<SelectedProfessional> {
    return this._professionals;
  }

  private _total = 0;

  get total(): number {
    return this._total;
  }

  private _config: Config = {
    fields: 'language firstName lastName companyOriginalName country emailConfidence jobTitle campaigns tags messages ambassador.is',
    limit: this._configService.configLimit('admin-pros-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  get config(): Config {
    return this._config;
  }

  set config(value: Config) {
    this._config = value;
    this._getProfessionals();
  }

  private _fetchingError = false;

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  private _isLoading = true;

  get isLoading(): boolean {
    return this._isLoading;
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
    }
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(['professionals']);
  }

  private _getProfessionals() {
    this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._professionals = response && response.result || [];
      console.log(response);
      this._total = response && response._metadata && response._metadata.totalCount;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Error', ErrorFrontService.getErrorMessage(err.status));
      this._fetchingError = true;
      this._isLoading = false;
      console.error(err);
    });
  }

}
