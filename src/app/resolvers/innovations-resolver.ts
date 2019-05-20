import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { InnovationService } from '../services/innovation/innovation.service';
import { Innovation } from '../models/innovation';

const INNOVATIONS_KEY = makeStateKey('allInnovations');

@Injectable()
export class InnovationsResolver implements Resolve<Array<Innovation>> {

  private _config = {
    fields: 'created principalMedia innovationCards tags status projectStatus',
    limit: '0',
    offset: '0',
    isPublic: '1',
    $or: '[{"status":"EVALUATING"},{"status":"DONE"}]',
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _innovationService: InnovationService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Array<Innovation>> {

    if (this._transferState.hasKey(INNOVATIONS_KEY)) {
      const innovations = this._transferState.get<Array<Innovation>>(INNOVATIONS_KEY, null);
      this._transferState.remove(INNOVATIONS_KEY);

      return new Observable((observer) => {
        observer.next(innovations);
        observer.complete();
      });

    } else {
      return this._innovationService.getAll(this._config).pipe(
        map((response: any) => response.result),
        tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(INNOVATIONS_KEY, response as Array<Innovation>);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }


  get config(): any {
    return this._config;
  }


}


