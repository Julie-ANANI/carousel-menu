import { Component, Input } from '@angular/core';
import { countries } from '../../../models/static-data/country';

@Component({
  selector: 'app-utility-country-flag',
  templateUrl: './country-flag.component.html',
  styleUrls: ['./country-flag.component.scss'],
})
export class CountryFlagComponent {

  @Input() set country(value: any) {
    this._country = value;
    this._updateFlag();
  }

  @Input() width = 37;

  @Input() height = 25;

  private _country: any = null;

  private _url = '';

  private _name = '';

  private _updateFlag() {
    let flag = '00';

    if (this._country && typeof this._country === 'string') {
      flag = this._country.toUpperCase();
    } else if (this._country && this._country.flag) {
      flag = this._country.flag.toUpperCase();
    }

    this._url = `https://res.cloudinary.com/umi/image/upload/app/flags/${flag}.png`;
    flag = flag === 'UK' ? 'GB' : flag;
    this._name = countries[flag] || 'Unknown';
  }

  get url(): string {
    return this._url;
  }

  get name(): string {
    return this._name;
  }

  get countryToDisplay(): boolean {
    return !!this._country;
  }
}
