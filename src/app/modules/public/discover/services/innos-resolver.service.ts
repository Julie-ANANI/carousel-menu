import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Innovation } from '../../../../models/innovation';
import { InnovationService } from '../../../../services/innovation/innovation.service';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

const INNOVATIONS_KEY = makeStateKey('innovations');

@Injectable()
export class InnovationsResolver implements Resolve<Array<Innovation>> {

  config = {
    fields: 'created principalMedia innovationCards tags status projectStatus',
    limit: '0',
    offset: '0',
    search: '{"isPublic":"1","$or":[{"status":"EVALUATING"},{"status":"DONE"}]}',
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private innovationService: InnovationService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Innovation>> {
    if (this.state.hasKey(INNOVATIONS_KEY)) {
      const innovations = this.state.get<Array<Innovation>>(INNOVATIONS_KEY, null);
      this.state.remove(INNOVATIONS_KEY);
      return new Observable((observer) => {
        observer.next(innovations);
        observer.complete();
      });
    } else {
      return this.innovationService.getAll(this.config)
        .pipe(
          map((innovations: any) => innovations.result),
          tap((innovations) => {
              if (isPlatformServer(this.platformId)) {
                this.state.set(INNOVATIONS_KEY, innovations as Array<Innovation>);
              }
          }),
          catchError(() => {
            return Observable.empty();
          })
        );
    }
  }
}
