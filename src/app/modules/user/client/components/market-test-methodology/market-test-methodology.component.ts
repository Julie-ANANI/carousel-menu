import {Component, Input} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-market-test-methodology',
  templateUrl: './market-test-methodology.component.html',
  styleUrls: ['./market-test-methodology.component.scss']
})
export class MarketTestMethodologyComponent {

  private _case = '';

  private _image = '';

  /**
   *
   * @param value
   */
  @Input() set methodology(value: string) {
    this._initValue(value);
  }

  /**
   * we are using this for the old mission template. For the new
   * one we have the methodology value.
   * @param value
   */
  @Input() set objective(value: string) {
    this._initValue(value);
  }

  constructor(private _translateService: TranslateService) { }

  private _initValue(value: string) {
    switch (value) {
      case 'Detecting market needs':
      case 'DETECTING_MARKET':
        this._case = 'DETECTING_MARKET';
        this._image = 'detecting-';
        break;

      case 'Validating market needs':
      case 'VALIDATING_MARKET':
        this._case = 'VALIDATING_MARKET';
        this._image = 'validating-market-';
        break;

      case 'Sourcing solutions / suppliers':
      case 'SOURCING_SOLUTIONS':
        this._case = 'SOURCING_SOLUTIONS';
        this._image = 'sourcing-';
        break;

      case 'Identifying receptive markets':
      case 'IDENTIFYING_RECEPTIVE':
        this._case = 'IDENTIFYING_RECEPTIVE';
        this._image = 'identifying-';
        break;

      case 'Validating the interest in my project':
      case 'VALIDATING_INTEREST':
        this._case = 'VALIDATING_INTEREST';
        this._image = 'validating-interest-';
        break;

      case 'Optimizing my value proposition':
      case 'OPTIMIZING_VALUE':
        this._case = 'OPTIMIZING';
        this._image = 'optimizing-';
        break;
    }
  }

  get caseImage(): string {
    if (!!this._image) {
      return 'https://res.cloudinary.com/umi/image/upload/app/default-images/configurator/' + this._image + this.currentLang + '.png';
    }

    return '';
  }

  get currentLang(): string {
    return this._translateService.currentLang;
  }

  get case(): string {
    return this._case;
  }

  get image(): string {
    return this._image;
  }

}
