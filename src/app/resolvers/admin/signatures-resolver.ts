import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Config } from '../../models/config';
import { ConfigService } from '../../services/config/config.service';
import { Response } from '../../models/response';
import { TemplatesService } from '../../services/templates/templates.service';

const SIGNATURES_KEY = makeStateKey('signatures');

@Injectable()
export class SignaturesResolver implements Resolve<Response> {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "id": -1 }'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _templatesService: TemplatesService,
              private _configService: ConfigService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(SIGNATURES_KEY)) {
      const signatures = this._transferState.get<Response>(SIGNATURES_KEY, null);
      this._transferState.remove(SIGNATURES_KEY);

      return new Observable((observer) => {
        observer.next(signatures);
        observer.complete();
      });

    } else {

      this._config.limit = this._configService.configLimit('admin-signatures-limit');

      return this._templatesService.getAllSignatures(this._config)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(SIGNATURES_KEY, response as Response);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }

  get config(): Config {
    return this._config;
  }

}


