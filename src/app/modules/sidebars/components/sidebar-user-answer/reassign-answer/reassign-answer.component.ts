import {Component, EventEmitter, Output} from '@angular/core';
import {ProfessionalsService} from '../../../../../services/professionals/professionals.service';
import {first} from 'rxjs/operators';
import {TranslateNotificationsService} from '../../../../../services/notifications/notifications.service';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorFrontService} from '../../../../../services/error/error-front.service';
import {Config} from '../../../../../models/config';
import {AutoCompleteInputConfigInterface} from '../../../../utility/auto-complete-input/interfaces/auto-complete-input-config-interface';

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

  get countryConfig(): AutoCompleteInputConfigInterface {
    return this._countryConfig;
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

  private _countryConfig: AutoCompleteInputConfigInterface = {
    placeholder: 'Enter the country',
    type: 'countries',
    initialData: []
  };

  constructor(private _professionalService: ProfessionalsService,
              private _translateNotificationsService: TranslateNotificationsService,) { }

  public emitPro(type = '') {
    if (type === 'EMAIL' && !!this._newPro.email) {
      this._isSearchingPro = true;
      this._proConfig.email = this._newPro.email;

      this._professionalService.getAll(this._proConfig).pipe(first()).subscribe((response) => {
        this._isSearchingPro = false;
        console.log(response);
        if (response && response.result && response.result.length) {
          const _pro = response.result[0];
          this._newPro = {
            firstName: _pro.firstName,
            lastName: _pro.lastName,
            email: _pro.email,
            jobTitle: _pro.jobTitle,
            company: _pro.company,
            country: _pro.country
          };
          this._countryConfig.initialData[0] = _pro.country;
        }
      }, (err: HttpErrorResponse) => {
        this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
        this._isSearchingPro = false;
        console.error(err);
      });
    } else {
      this.proToAssign.emit(this._newPro);
    }
  }

  public updateCountry(event: {value: Array<any>}) {
    this._newPro.country = event.value[0];
    this.emitPro();
  }

  get newPro(): NewPro {
    return this._newPro;
  }

}
