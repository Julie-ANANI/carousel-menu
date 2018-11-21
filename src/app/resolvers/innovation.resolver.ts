/**
 * Created by bastien on 10/01/2018.
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { InnovationService } from '../services/innovation/innovation.service';

@Injectable()
export class InnovationResolver implements Resolve<any> {
  constructor(
    private _innovationService: InnovationService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._innovationService.get(route.params.projectId);
  }
}
