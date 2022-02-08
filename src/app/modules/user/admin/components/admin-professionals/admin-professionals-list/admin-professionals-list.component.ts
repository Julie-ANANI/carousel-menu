import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {Professional} from '../../../../../../models/professional';
import {TranslateNotificationsService} from '../../../../../../services/translate-notifications/translate-notifications.service';
import {TranslateTitleService} from '../../../../../../services/title/title.service';
import {ProfessionalsService} from '../../../../../../services/professionals/professionals.service';
import {first} from 'rxjs/operators';
import {Response} from '../../../../../../models/response';
import {isPlatformBrowser} from '@angular/common';
import {RolesFrontService} from '../../../../../../services/roles/roles-front.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../../services/error/error-front.service';
import {UmiusConfigInterface, UmiusConfigService} from '@umius/umi-common-component';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  templateUrl: './admin-professionals-list.component.html',
})

export class AdminProfessionalsListComponent implements OnInit {

  private _professionals: Array<SelectedProfessional> = [];

  private _total = 0;

  private _config: UmiusConfigInterface = {
    fields: 'language firstName lastName companyOriginalName country emailConfidence jobTitle campaigns tags messages ambassador.is',
    limit: this._configService.configLimit('admin-pros-limit'),
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError = false;

  private _isLoading = true;

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              private _configService: UmiusConfigService,
              private _professionalsService: ProfessionalsService,
              private _rolesFrontService: RolesFrontService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {
    this._translateTitleService.setTitle('Professionals');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this._platformId)) {
      this._isLoading = false;
      // TODO test
      this._getProfessionals();
    }
  }

  public canAccess() {
    return this._rolesFrontService.hasAccessAdminSide(['professionals']);
  }

  private _getProfessionals() {
    this._professionalsService.search(this._config).pipe(first()).subscribe((response: Response) => {
      this._total = response && response._metadata && response._metadata.totalCount;
      this._professionals = response && response.result || [];
    }, (err: HttpErrorResponse) => {
      this._translateNotificationsService.error('Error', ErrorFrontService.getErrorKey(err.error));
      this._fetchingError = true;
      this._isLoading = false;
      console.error(err);
    });
  }

  get professionals(): Array<SelectedProfessional> {
    return this._professionals;
  }

  get total(): number {
    return this._total;
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

  set config(value: UmiusConfigInterface) {
    this._config = value;
    this._getProfessionals();
  }

  get fetchingError(): boolean {
    return this._fetchingError;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

}
