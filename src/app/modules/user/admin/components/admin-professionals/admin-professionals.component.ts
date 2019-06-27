import { Component } from '@angular/core';
import { Config } from '../../../../../models/config';
import { ActivatedRoute } from '@angular/router';
import { Professional } from '../../../../../models/professional';
import { TranslateNotificationsService } from '../../../../../services/notifications/notifications.service';
import { TranslateTitleService } from '../../../../../services/title/title.service';
import { ProfessionalsService } from '../../../../../services/professionals/professionals.service';
import { first } from 'rxjs/operators';
import { Response } from '../../../../../models/response';

export interface SelectedProfessional extends Professional {
  isSelected: boolean;
}

@Component({
  selector: 'app-admin-pros',
  templateUrl: './admin-professionals.component.html',
  styleUrls: ['./admin-professionals.component.scss']
})

export class AdminProfessionalsComponent {

  private _professionals: Array<SelectedProfessional> = [];

  private _total: number;

  private _config: Config = {
    fields: 'language firstName lastName company country jobTitle campaigns tags messages ambassador.is',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  private _fetchingError: boolean;

  constructor(private _activatedRoute: ActivatedRoute,
              private _professionalsService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _translateTitleService: TranslateTitleService) {

    this._translateTitleService.setTitle('COMMON.PAGE_TITLE.PROFESSIONALS');

    if (this._activatedRoute.snapshot.data.professionals && Array.isArray(this._activatedRoute.snapshot.data.professionals.result)) {
      this._professionals = this._activatedRoute.snapshot.data.professionals.result;
      this._total = this._activatedRoute.snapshot.data.professionals._metadata.totalCount;
    } else {
      this._fetchingError = true;
    }

  }

  private _getProfessionals() {
    this._professionalsService.getAll(this._config).pipe(first()).subscribe((response: Response) => {
      this._professionals = response.result;
      this._total = response._metadata.totalCount;
    }, () => {
      this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.CANNOT_REACH');
    });
  }

  set config(value: Config) {
    this._config = value;
    console.log(value);
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
