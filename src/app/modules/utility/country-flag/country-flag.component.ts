import { Component, Input } from '@angular/core';
import { countries } from '../../../models/static-data/country';

@Component({
  selector: 'app-utility-country-flag',
  template: `
    <div *ngIf="countryToDisplay" [attr.data-tooltip]="name" class="tooltip d-flex" id="country-flag">
      <img
        [height]="height"
        [ngStyle]="{ 'height': height + 'px', 'width': width + 'px' }"
        [src]="url"
        [width]="width"
        alt=" ">
    </div>
  `,
  styleUrls: ['./country-flag.component.scss'],
})
export class CountryFlagComponent {
  private _country: any;

  @Input() set country(value: any) {
    this._country = value;
    this.updateFlag();
  }

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

    flag = flag === 'UK' ? 'GB' : flag;
    this._name = countries[flag] || 'Unknown';
  }

  get url(): string {
    return this._url;
  }

  get name(): string {
    return this._name;
  }

  get countryToDisplay(): Boolean {
    return !!this._country;
  }
}
