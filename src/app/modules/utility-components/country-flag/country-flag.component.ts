import { Component, Input } from '@angular/core';
import { countries } from '../../../models/static-data/country';

@Component({
  selector: 'app-country-flag',
  templateUrl: './country-flag.component.html',
  styleUrls: ['./country-flag.component.scss']
})
export class CountryFlagComponent {

  private _country: any;

  @Input() set country(value: any) {
    this._country = value;
    this.updateFlag();
  };

  @Input() width = 37;

  @Input() height = 25;

  private _url: string;

  private _name: string;

  updateFlag() {
    let flag = '00';

    if (this._country && typeof this._country === 'string') {
      flag = this._country.toUpperCase();
    } else if (this._country && this._country.flag) {
      flag = this._country.flag.toUpperCase();
    }

    this._url = `https://res.cloudinary.com/umi/image/upload/app/flags/${flag}.png`;

    this._name = countries[flag] || 'Unknown';
  }

  get url(): string {
    return this._url;
  }

  get name(): string {
    return this._name;
  }


}
