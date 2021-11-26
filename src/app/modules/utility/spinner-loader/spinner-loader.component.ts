import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SpinnerService } from '../../../services/spinner/spinner.service';

/***
 * use the spinner service to show the full page spinner.
 */

@Component({
  selector: 'app-utility-spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss']
})

export class SpinnerLoaderComponent implements OnInit, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _spinnerState = false;

  private _logoSrc = environment.logoURL;

  private _isUmiDomain = environment.domain === 'umi';

  constructor(private _spinnerService: SpinnerService) { }

  ngOnInit() {
    this._spinnerService.spinner().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._spinnerState = response;
    });
  }

  get spinnerState(): boolean {
    return this._spinnerState;
  }

  get logoSrc(): string {
    return this._logoSrc;
  }

  get isUmiDomain(): boolean {
    return this._isUmiDomain;
  }

  ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

}
