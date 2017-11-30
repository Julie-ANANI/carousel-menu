import { Injectable } from '@angular/core';
import {
  Http as AngularHttp,
  RequestOptionsArgs,
  Response,
  Headers,
  XHRBackend,
  ResponseContentType
} from '@angular/http';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader/loader.service';
import { RequestOptions } from './requestOptions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { NotificationsService } from 'angular2-notifications';

export { Response } from '@angular/http';

@Injectable()
export class Http extends AngularHttp {
  private _apiUrl = environment.apiUrl;

  constructor(protected _backend: XHRBackend,
              protected _defaultOptions: RequestOptions,
              private _loaderService: LoaderService,
              protected _notificationsService: NotificationsService) {
    super(_backend, _defaultOptions);
  }

  public get(UriOrUrl: string, options?: RequestOptionsArgs): Observable<any> {
    this._showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return super.get(UriOrUrl, this._requestOptions(options))
      .catch(this._onCatch)
      .do((res: Response) => {
        this._onSuccess(res);
      }, (error: any) => {
        this._onError(error);
      })
      .finally(() => {
        this._onEnd();
      });
  }

  public post(UriOrUrl: string, data?: object, options?: RequestOptionsArgs) {
    this._showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return super.post(UriOrUrl, data, this._requestOptions(options))
      .catch(this._onCatch)
      .do((res: Response) => {
        this._onSuccess(res);
      }, (error: any) => {
        this._onError(error);
      })
      .finally(() => {
        this._onEnd();
      });
  }

  public put(UriOrUrl: string, data?: object, options?: RequestOptionsArgs) {
    this._showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return super.put(UriOrUrl, data, this._requestOptions(options))
      .catch(this._onCatch)
      .do((res: Response) => {
        this._onSuccess(res);
      }, (error: any) => {
        this._onError(error);
      })
      .finally(() => {
        this._onEnd();
      });
  }

  public delete(UriOrUrl: string, options?: RequestOptionsArgs) {
    this._showLoader();

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return super.delete(UriOrUrl, this._requestOptions(options))
      .catch(this._onCatch)
      .do((res: Response) => {
        this._onSuccess(res);
      }, (error: any) => {
        this._onError(error);
      })
      .finally(() => {
        this._onEnd();
      });
  }

  public download(UriOrUrl: string, options?: RequestOptionsArgs) {
    this._showLoader();
    if(!options) {
      options = new RequestOptions();
    }
    options.responseType = ResponseContentType.Blob;

    if (UriOrUrl.indexOf('http') === -1) { // Si ce n'est pas une URL
      UriOrUrl = this._getFullUrl(UriOrUrl);
    }

    return super.get(UriOrUrl, this._requestOptions(options))
      .catch(this._onCatch)
      .do((res: Response) => {
        this._onSuccess(res);
      }, (error: any) => {
        this._onError(error);
      })
      .finally(() => {
        this._onEnd();
      });
  }

  private _requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
    if (!options) {
      options = new RequestOptions();
    }

    if (options.headers === null) {
      options.headers = new Headers();
    }

    options.withCredentials = true;

    return options;
  }

  private _getFullUrl(uri: string): string {
    return this._apiUrl + uri;
  }

  private _showLoader(): void {
    this._loaderService.startLoading();
  }

  private _hideLoader(): void {
    this._loaderService.stopLoading();
  }

  private _onCatch(error: any, caught: Observable<any>): Observable<any> {
    return Observable.throw(error);
  }

  private _onSuccess(res: Response): void { }

  private _onError(res: Response): void {
    console.error(res);
    this._notificationsService.error('Error ' + res.status, res.toString()); // TODO éventuellement commenter pour la PROD
  }

  private _onEnd(): void {
    this._hideLoader();
  }

  public getApiUrl(): string {
    return this._apiUrl;
  }
}
