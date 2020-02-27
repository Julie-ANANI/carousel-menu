import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SpinnerService } from '../../../services/spinner/spinner';

/***
 * use this component when you want to show the full page spinner
 * just use the spinner service in the parent component and pass the
 * value through the service when to start and stop the spinner.
 * example: admin project storyboard (admin-project-storyboard componnet).
 */

@Component({
  selector: 'app-spinner-loader',
  templateUrl: './spinner-loader.component.html',
  styleUrls: ['./spinner-loader.component.scss']
})

export class SpinnerLoaderComponent implements OnInit, OnDestroy {

  private _ngUnsubscribe: Subject<any> = new Subject<any>();

  private _spinnerState = false;

  private _logoSrc = '';

  private _isUmiDomain = false;

  constructor(private _spinner: SpinnerService) { }

  ngOnInit() {

    this._logoSrc = this.getLogo();
    this._isUmiDomain = this.getDomain() === 'umi';

    this._spinner.spinner().pipe(takeUntil(this._ngUnsubscribe)).subscribe((response) => {
      this._spinnerState = response;
    });

  }

  getLogo(): string {
    return environment.logoURL;
  }

  getDomain(): string {
    return environment.domain;
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
