import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Config } from '../../models/config';
import { InnovationService } from '../../services/innovation/innovation.service';
import { ConfigService } from '../../services/config/config.service';
import { Response } from '../../models/response';

const INNOVATIONS_KEY = makeStateKey('projects');

@Injectable()
export class ProjectsResolver implements Resolve<Response> {

  private _config: Config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _innovationService: InnovationService,
              private _configService: ConfigService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(INNOVATIONS_KEY)) {
      const innovations = this._transferState.get<Response>(INNOVATIONS_KEY, null);
      this._transferState.remove(INNOVATIONS_KEY);

      return new Observable((observer) => {
        observer.next(innovations);
        observer.complete();
      });

    } else {

      this._config.limit = this._configService.configLimit('admin-projects-limit');

      return this._innovationService.getAll(this._config)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(INNOVATIONS_KEY, response as Response);
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


