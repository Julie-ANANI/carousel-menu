import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';

/***
 * Do not use this spinner component. This is a main spinner loader that we use when
 * - application starts.
 */
@Component({
  selector: 'app-utility-spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss']
})

export class SpinnerLoaderComponent {

  get logoSrc(): string {
    return this._logoSrc;
  }

  get isUmiDomain(): boolean {
    return this._isUmiDomain;
  }

  @Input() spinnerState = true;

  private _logoSrc = environment.logoURL;

  private _isUmiDomain = environment.domain === 'umi';

}
