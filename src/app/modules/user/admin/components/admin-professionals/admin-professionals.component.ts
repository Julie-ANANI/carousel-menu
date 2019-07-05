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

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-admin-pros',
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent implements OnInit {

  private _professionals: Array<SelectedProfessional> = [];

  private _total: number = -1;

  private _config: Config = {
    fields: 'language firstName lastName company country jobTitle campaigns tags messages ambassador.is',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError: boolean;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: ConfigService,
              private _professionalsService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROFESSIONALS');

  }

  ngOnInit(): void {

    if (isPlatformBrowser(this._platformId)) {

      this._config.limit = this._configService.configLimit('admin-pros-limit');

      this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
        this._professionals = response.result;
        this._total = response._metadata.totalCount;
      }, () => {
        this._fetchingError = true;
      });
    }

  }

  private _getProfessionals() {
    this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._professionals = response.result;
      this._total = response._metadata.totalCount;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.FETCHING_ERROR');
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

}
