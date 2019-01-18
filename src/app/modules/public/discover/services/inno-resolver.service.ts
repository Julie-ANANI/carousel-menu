import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';

const INNOVATION_KEY = makeStateKey('innovation');

@Injectable()
export class InnovationResolver implements Resolve<Innovation> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private innovationService: InnovationService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Innovation> {
    if (this.state.hasKey(INNOVATION_KEY)) {
      const innovation = this.state.get<Innovation>(INNOVATION_KEY, null);
      this.state.remove(INNOVATION_KEY);
      return new Observable((observer) => {
        observer.next(innovation);
        observer.complete();
      });
    } else {
      const innovationId = route.paramMap.get('id') || '';
      return this.innovationService.get(innovationId)
        .pipe(
          tap((innovation) => {
            if (isPlatformServer(this.platformId)) {
              this.state.set(INNOVATION_KEY, innovation as Innovation);
            }
          }),
          catchError(() => {
            return Observable.empty();
          })
        );
    }
  }
}
