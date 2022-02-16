import {Component, EventEmitter, Output} from '@angular/core';
import {ProfessionalsService} from '../../../../../services/professionals/professionals.service';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../../../services/translate-notifications/translate-notifications.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../services/error/error-front.service';
import { Config } from '@umius/umi-common-component/models';
import {Company} from '../../../../../models/company';
import {Country} from '../../../../../models/country';
import {countries} from '../../../../../models/static-data/country';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {emailRegEx} from '../../../../../utils/regex';

export interface NewPro {
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
  company: string | Company;
  country: string | Country;
}

@Component({
  selector: 'app-reassign-answer',
  templateUrl: './reassign-answer.component.html',
})

export class ReassignAnswerComponent {
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

  //private _formBuilder: FormBuilder;

  private _formData = this._formBuilder.group({
 /*   firstName: ['', [Validators.required ]],
    lastName: ['', [Validators.required]],*/
    email: ['', [Validators.required, Validators.pattern(emailRegEx)]],
   /* jobTitle: ['', [Validators.required]],
    company: ['', [Validators.required]],
    country: ['', [Validators.required]],*/
  });

constructor(private _professionalService: ProfessionalsService,
            private _translateNotificationsService: TranslateNotificationsService,
            private _formBuilder: FormBuilder) { }

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
          this._company = _pro.company;
          this._country = (_pro.country && _pro.country.flag) ? _pro.country : {
            name: countries[_pro.country],
            flag: _pro.country,
            domain: ''
          };

          this._newPro = {
            firstName: _pro.firstName,
            lastName: _pro.lastName,
            email: _pro.email,
            jobTitle: _pro.jobTitle,
            company: '',
            country: ''
          };
          this._emit();
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
        this._isSearchingPro = false;
        console.error(err);
      });
    } else {
      this._emit();
    }
  }

  private _emit() {
    this._newPro.country = this._country;
    this._newPro.company = this._company.name;
    this.proToAssign.emit(this._newPro);
  }

  public onCountrySelect(event: Country) {
    this._country = event;
    this.emitPro();
  }

  public onCompanySelect(event: Company) {
    this._company = event;
    this.emitPro();
  }

 /* public onClickContinue() {
    if (this._formData.valid) {
      this._newPro.firstName = this._formData.value;
      this._newPro.lastName = this._formData.value;
      this._newPro.email = this._formData.value;
/!*      this._newPro.jobTitle = this._formData.value;
      this._newPro.country = this._formData.value;*!/!*!/
    } else {
      if (this._formData.untouched && this._formData.pristine) {
        this._translateNotificationsService.error('ERROR.ERROR', 'ERROR.INVALID_FORM_DATA');
      }
    }
  }*/

  get newPro(): NewPro {
    return this._newPro;
  }

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

  get formData(): FormGroup {
    return this._formData;
  }
}
