import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { Innovation } from '../../../models/innovation';
import { InnovationService } from '../../../services/innovation/innovation.service';
import { Observable } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';

const INNOVATIONS_KEY = makeStateKey('innovations');

@Injectable()
export class InnovationsResolver implements Resolve<Array<Innovation>> {

  config = {
    fields: 'created innovationCards tags status projectStatus',
    limit: '0',
    offset: '0',
    search: '{"isPublic":"1","$or":[{"status":"EVALUATING"},{"status":"DONE"}]}',
    sort: '{"created":-1}'
  };

  innovations: Array<Innovation>;

  constructor(private innovationService: InnovationService, private state: TransferState) {
    this.innovations = this.state.get(INNOVATIONS_KEY, null as Array<Innovation>);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Innovation>> {
    if (this.innovations) {
      return new Observable((observer) => {
        observer.next(this.innovations);
        observer.complete();
      });
    } else {
      return this.innovationService.getAll(this.config)
        .pipe(
          take(1),
          map((innovations: any) => innovations.result),
          tap((innovations) => {
            this.state.set(INNOVATIONS_KEY, innovations as Array<Innovation>);
          }),
          catchError(() => {
            return Observable.empty();
          })
        );
    }
  }
}
