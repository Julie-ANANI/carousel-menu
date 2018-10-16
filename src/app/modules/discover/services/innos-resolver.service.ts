import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Innovation } from '../../../models/innovation';
import { InnovationService } from '../../../services/innovation/innovation.service';
import { Observable } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';

@Injectable()
export class InnovationsResolver implements Resolve<Array<Innovation>> {

  config = {
    fields: 'created innovationCards tags status projectStatus',
    limit: 0,
    offset: 0,
    search: {
      isPublic: 1,
      '$or': [
        {'status': 'EVALUATING'},
        {'status': 'DONE'}
      ]
    },
    sort: {
      created: -1
    }
  };

  constructor(private innovationService: InnovationService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Innovation>> {
    return this.innovationService.getAll(this.config)
      .pipe(
        take(1),
        map((innovations: any) => innovations.result),
        catchError(() => {
          return Observable.empty();
        })
      );
  }
}
