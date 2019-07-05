import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Config } from '../../models/config';
import { ConfigService } from '../../services/config/config.service';
import { Response } from '../../models/response';
import { ProfessionalsService } from '../../services/professionals/professionals.service';

const PROFESSIONALS_KEY = makeStateKey('professionals');

@Injectable()
export class ProfessionalsResolver implements Resolve<Response> {

  private _config: Config = {
    fields: 'language firstName lastName company country jobTitle campaigns tags messages ambassador.is',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _professionalService: ProfessionalsService,
              private _configService: ConfigService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(PROFESSIONALS_KEY)) {
      const professionals = this._transferState.get<Response>(PROFESSIONALS_KEY, null);
      this._transferState.remove(PROFESSIONALS_KEY);

      return new Observable((observer) => {
        observer.next(professionals);
        observer.complete();
      });

    } else {

      this._config.limit = this._configService.configLimit('admin-pros-limit');

      return this._professionalService.getAll(this._config)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(PROFESSIONALS_KEY, response as Response);
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


