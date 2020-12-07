/**
 * Created by bastien on 10/01/2018.
 */
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import {Innovation} from '../models/innovation';
import {InnovationService} from '../services/innovation/innovation.service';
import {EMPTY, Observable} from 'rxjs';
import {catchError, first, tap} from 'rxjs/operators';
import {HttpErrorResponse} from '@angular/common/http';
import {Config} from '../models/config';

const INNOVATION_KEY = makeStateKey('innovation');
const config: Config = {
  fields: '',
  limit: '10',
  offset: '0',
  search: '{}',
  sort: '{ "created": "-1" }'
};

@Injectable({providedIn: 'root'})
export class InnovationResolver implements Resolve<Innovation> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private _innovationService: InnovationService,
              private _transferState: TransferState) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Innovation> {

    if (this._transferState.hasKey(INNOVATION_KEY)) {
      const innovation = this._transferState.get<Innovation>(INNOVATION_KEY, <Innovation>{});
      this._transferState.remove(INNOVATION_KEY);

      return new Observable((observer) => {
        observer.next(innovation);
        observer.complete();
      });

    } else {
      config.isDiscover = (routerStateSnapshot.url.includes('discover')) ? '1' : '0';
      const innovationId = activatedRouteSnapshot.paramMap.get('projectId') || '';

      return this._innovationService.get(innovationId, config)
        .pipe(first(),
          tap((innovation) => {
            if (isPlatformServer(this.platformId)) {
              this._transferState.set(INNOVATION_KEY, innovation as Innovation);
            }
          }),
          catchError((err: HttpErrorResponse) => {
            console.error(err);
            return EMPTY;
          })
        );

    }

  }
}
