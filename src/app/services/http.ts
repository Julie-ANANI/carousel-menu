import { Injectable } from '@angular/core';
import {
  Http as AngularHttp,
  RequestOptionsArgs,
  Response,
  Headers,
  XHRBackend
} from '@angular/http';
import { environment } from '../../environments/environment';
import { LoaderService } from './loader/loader.service';
import { RequestOptions } from './requestOptions';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

export { Response } from '@angular/http';

@Injectable()
export class Http extends AngularHttp {
  private _apiUrl = environment.apiUrl;

  constructor(protected _backend: XHRBackend,
              protected _defaultOptions: RequestOptions,
              private _loaderService: LoaderService) {
    super(_backend, _defaultOptions);
  }

  public get(uri: string, options?: RequestOptionsArgs): Observable<any> {
    this._showLoader();
    return super.get(this._getFullUrl(uri), this._requestOptions(options))
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

  public post(uri: string, data?: object, options?: RequestOptionsArgs) {
    this._showLoader();
    return super.post(this._getFullUrl(uri), data, this._requestOptions(options))
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

  public put(uri: string, data?: object, options?: RequestOptionsArgs) {
    this._showLoader();
    return super.put(this._getFullUrl(uri), data, this._requestOptions(options))
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

  public delete(uri: string, options?: RequestOptionsArgs) {
    this._showLoader();
    return super.delete(this._getFullUrl(uri), this._requestOptions(options))
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

  private _onSuccess(res: Response): void {
    // console.log('Request successful');
  }

  private _onError(res: Response): void {
    console.log('Error, status code: ' + res.status);
  }

  private _onEnd(): void {
    this._hideLoader();
  }

  public getApiUrl(): string {
    return this._apiUrl;
  }
}
