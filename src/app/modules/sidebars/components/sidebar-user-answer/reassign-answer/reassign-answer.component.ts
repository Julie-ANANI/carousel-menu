import {Component, EventEmitter, Output} from '@angular/core';
import {ProfessionalsService} from '../../../../../services/professionals/professionals.service';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../services/error/error-front.service';
import {Config} from '../../../../../models/config';
import {Company} from '../../../../../models/company';
import {Country} from '../../../../../models/country';

export interface NewPro {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company: string;
  country: string;
}

@Component({
  selector: 'app-reassign-answer',
  templateUrl: './reassign-answer.component.html',
  styleUrls: ['./reassign-answer.component.scss']
})

export class ReassignAnswerComponent {

  get company(): Company {
    return this._company;
  }

  get country(): Country {
    return this._country;
  }

  get showBanner(): boolean {
    return this._showBanner;
  }

  get proFound(): number {
    return this._proFound;
  }

  get isSearchingPro(): boolean {
    return this._isSearchingPro;
  }

  get proConfig(): Config {
    return this._proConfig;
  }

  @Output() proToAssign: EventEmitter<NewPro> = new EventEmitter<NewPro>();

  private _newPro: NewPro = <NewPro>{};

  private _proConfig: Config = {
    fields: 'firstName lastName company email country jobTitle',
    limit: '1',
    offset: '0',
    search: '{}',
    email: '',
    sort: '{ "created": -1 }'
  };

  private _isSearchingPro = false;

  private _proFound = 0;

  private _showBanner = false;

  private _country: Country = <Country>{};

  private _company: Company = <Company>{};

  constructor(private _professionalService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService) { }

  public emitPro(type = '') {
    if (type === 'EMAIL' && !!this._newPro.email) {
      this._showBanner = this._isSearchingPro = true;
      this._proFound = 0;
      this._proConfig.email = this._newPro.email;

      this._professionalService.getAll(this._proConfig).pipe(first()).subscribe((response) => {
        this._isSearchingPro = false;
        if (response && response.result && response.result.length) {
          this._proFound = 1;
          const _pro = response.result[0];
          this._country = (_pro.country && _pro.country.name) ? _pro.country : {name: _pro.country};
          this._company = _pro.company;

          this._newPro = {
            firstName: _pro.firstName,
            lastName: _pro.lastName,
            email: _pro.email,
            jobTitle: _pro.jobTitle,
            company: (this._company && this._company.name) || '',
            country: (this._country && this._country.name) || ''
          };
          this._emit();
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
        this._isSearchingPro = false;
        console.error(err);
      });
    } else {
      this._emit();
    }
  }

  private _emit() {
    this.proToAssign.emit(this._newPro);
  }

  public onCountrySelect(event: Country) {
    this._country = event;
    this._newPro.country = this._country.flag;
    this.emitPro();
  }

  public onCompanySelect(event: Company) {
    this._company = event;
    this._newPro.company = this._company.name;
    this.emitPro();
  }

  get newPro(): NewPro {
    return this._newPro;
  }

}
