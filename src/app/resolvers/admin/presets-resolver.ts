import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Response } from '../../models/response';
import { PresetService } from '../../services/preset/preset.service';
import {UmiusConfigService} from '@umius/umi-common-component';
import {Config} from '../../models/config';

const PRESETS_KEY = makeStateKey('presets');

@Injectable({providedIn: 'root'})
export class PresetsResolver implements Resolve<Response> {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _presetsService: PresetService,
              private _configService: UmiusConfigService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(PRESETS_KEY)) {
      const presets = this._transferState.get<Response>(PRESETS_KEY, null);
      this._transferState.remove(PRESETS_KEY);

      return new Observable((observer) => {
        observer.next(presets);
        observer.complete();
      });

    } else {

      this._config.limit = this._configService.configLimit('admin-presets-limit');

      return this._presetsService.getAll(this._config)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(PRESETS_KEY, response as Response);
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


