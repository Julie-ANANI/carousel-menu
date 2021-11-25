import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Innovation} from '../../models/innovation';
import {EMPTY, Observable} from 'rxjs';
import {catchError, first, tap} from 'rxjs/operators';
import {isPlatformServer} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';
import {InnovationService} from '../../services/innovation/innovation.service';
import {makeStateKey, TransferState} from '@angular/platform-browser';
import { Config } from '@umius/umi-common-component/models';
import {TranslateNotificationsService} from '../../services/notifications/notifications.service';
import {ErrorFrontService} from '../../services/error/error-front.service';

const INNOVATION_KEY = makeStateKey('innovation');
const config: Config = {
  fields: '',
  limit: '1',
  offset: '0',
  search: '{}',
  sort: '{}'
};

@Injectable({providedIn: 'root'})
export class AdminInnovationResolver implements Resolve<Innovation> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private _innovationService: InnovationService,
              private _translateNotificationsService: TranslateNotificationsService,
              private _transferState: TransferState) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Innovation> | Promise<Innovation> | Innovation {
    if (this._transferState.hasKey(INNOVATION_KEY)) {
      const innovation = this._transferState.get<Innovation>(INNOVATION_KEY, <Innovation>{});
      this._transferState.remove(INNOVATION_KEY);

      return new Observable((observer) => {
        observer.next(innovation);
        observer.complete();
      });

    } else {
      const innovationId = route.paramMap.get('projectId');

      if (!!innovationId) {
        return this._innovationService.get(innovationId, config).pipe(first(), tap((innovation) => {
          if (isPlatformServer(this.platformId)) {
            this._transferState.set(INNOVATION_KEY, innovation as Innovation);
          }
        }), catchError((err: HttpErrorResponse) => {
          this._translateNotificationsService.error('ERROR.ERROR', ErrorFrontService.adminErrorMessage(err));
          console.error(err);
          return EMPTY;
        }));
      } else {
        return new Observable((observer) => {
          this._translateNotificationsService.error('ERROR', 'The requested URL could not be found.');
          observer.next(null);
          observer.complete();
        });
      }
    }
  }

}
