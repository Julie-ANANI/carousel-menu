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

  @Input() set objective(value: string) {
    switch (value) {
      case 'Detecting market needs':
        this._case = 'DETECTING_MARKET';
        this._image = 'detecting-market-needs-';
        break;

      case 'Validating market needs':
        this._case = 'VALIDATING_MARKET';
        this._image = 'validating-market-needs-';
        break;

      case 'Sourcing solutions / suppliers':
        this._case = 'SOURCING_SOLUTIONS';
        this._image = 'sourcing-solutions-suppliers-';
        break;

      case 'Identifying receptive markets':
        this._case = 'IDENTIFYING_RECEPTIVE';
        this._image = 'identifying-receptive-markets-';
        break;

      case 'Validating the interest in my project':
        this._case = 'VALIDATING_INTEREST';
        this._image = 'validating-the-interest-in-my-project-';
        break;

      case 'Optimizing my value proposition':
        this._case = 'OPTIMIZING';
        this._image = 'optimizing-my-value-proposition-';
        break;
    }
  }

  constructor(private _translateService: TranslateService) { }

  get caseImage(): string {
    if (!!this._image) {
      return 'https://res.cloudinary.com/umi/image/upload/app/default-images/configurator/' + this._image + 'fr' + '.png';
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
