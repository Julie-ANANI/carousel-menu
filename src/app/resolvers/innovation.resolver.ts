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
import { TranslateNotificationsService } from "../services/translate-notifications/translate-notifications.service";
import { ErrorFrontService } from "../services/error/error-front.service";
import {UmiusConfigInterface} from '@umius/umi-common-component';

const INNOVATION_KEY = makeStateKey('innovation');
const config: UmiusConfigInterface = {
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
              private _translateNotificationsService: TranslateNotificationsService,
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
            this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.getErrorKey(err.error));
            return EMPTY;
          })
        );

    }

  }
}
