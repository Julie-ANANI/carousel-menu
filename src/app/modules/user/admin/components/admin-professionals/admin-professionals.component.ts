import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Config } from '../../../../../models/config';
import { Professional } from '../../../../../models/professional';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ProfessionalsService } from '../../../../../services/professionals/professionals.service';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';
import { isPlatformBrowser } from '@angular/common';
import { ConfigService } from '../../../../../services/config/config.service';
import { RolesFrontService } from "../../../../../services/roles/roles-front.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorFrontService } from "../../../../../services/error/error-front.service";

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent implements OnInit {

  private _professionals: Array<SelectedProfessional> = [];

  private _total = -1;

  private _config: Config = {
    fields: 'language firstName lastName company country jobTitle campaigns tags messages ambassador.is',
    limit: this._configService.configLimit('admin-pros-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError = false;

  private _isLoading = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _professionalsService: ProfessionalsService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('Professionals');

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      this._getProfessionals();
    }
  }

  private _getProfessionals() {
    this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._professionals = response && response.result || [];
      this._total = response && response._metadata && response._metadata.totalCount;
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Error', ErrorFrontService.getErrorMessage(err.status));
      this._fetchingError = true;
      this._isLoading = false;
      console.error(err);
    });
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(['professionals']);
  }

  public updateDatabase() {
    this._professionalsService.cleanPros().pipe(first()).subscribe(() => {
      console.log('OK');
    });
  }

  set config(value: Config) {
    this._config = value;
    this._getProfessionals();
  }

  get config(): Config {
    return this._config;
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get professionals(): Array<SelectedProfessional> {
    return this._professionals;
  }

  get total(): number {
    return this._total;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

}
