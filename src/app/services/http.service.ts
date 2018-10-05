import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader/loader.service';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize, retry } from 'rxjs/operators';
import { TranslateNotificationsService } from './notifications/notifications.service';

@Injectable()
export class Http {

  private _apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient,
              private loaderService: LoaderService,
              private notificationsService: TranslateNotificationsService) {}

  public get(UriOrUrl: string, options?: {params: {[param: string]: string | string[]}}): Observable<any> {
    this.showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    const params = new HttpParams(options ? { fromObject: options.params } : {});

    return this.httpClient.get(UriOrUrl, {params})
      .pipe(
        retry(2),
        catchError(this._onCatch),
        tap((res: Response) => {
          this._onSuccess(res);
        }, (error: any) => {
          this._onError(error);
        }),
        finalize(() => {
          this._onEnd();
        })
      );
  }

  public post(UriOrUrl: string, data?: any, options?: any) {
    this.showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return this.httpClient.post(UriOrUrl, data, options)
      .pipe(
        catchError(this._onCatch),
        tap((res: Response) => {
          this._onSuccess(res);
        }, (error: any) => {
          this._onError(error);
        }),
        finalize(() => {
          this._onEnd();
        })
      );
  }

  public put(UriOrUrl: string, data?: object, options?: any) {
    this.showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return this.httpClient.put(UriOrUrl, data, options)
      .pipe(
        catchError(this._onCatch),
        tap((res: Response) => {
          this._onSuccess(res);
        }, (error: any) => {
          this._onError(error);
        }),
        finalize(() => {
          this._onEnd();
        })
      );
  }

  public delete(UriOrUrl: string, options?: any) {
    this.showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return this.httpClient.delete(UriOrUrl, options)
      .pipe(
        catchError(this._onCatch),
        tap((res: Response) => {
          this._onSuccess(res);
        }, (error: any) => {
          this._onError(error);
        }),
        finalize(() => {
          this._onEnd();
        })
      );
  }

  public upload(UriOrUrl: string, file: File, options?: any) {
    this.showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.httpClient.post(UriOrUrl, formData, options)
      .pipe(
        catchError(this._onCatch),
        tap((res: Response) => {
          this._onSuccess(res);
        }, (error: any) => {
          this._onError(error);
        }),
        finalize(() => {
          this._onEnd();
        })
      );
  }

  private _getFullUrl(uri: string): string {
    return this._apiUrl + uri;
  }

  private showLoader(): void {
    this.loaderService.startLoading();
  }

  private hideLoader(): void {
    this.loaderService.stopLoading();
  }

  private _onCatch(error: any, _: Observable<any>): Observable<any> {
    return throwError(error);
  }

  private _onSuccess(_: Response): void { }

  private _onError(res: Response): void {
    console.error(res);
    this.loaderService.stopLoading();
    if (!environment.production) {
      this.notificationsService.error('ERROR.ERROR ' + res.status, res.toString());
    }
  }

  private _onEnd(): void {
    this.hideLoader();
  }

}
