import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user.model';

@Injectable()
export class DashboardService {

  constructor(private _http: Http) {}

  public getOperators(): Observable<{result: Array<User>}> {
    return this._http.get('/user', {params: {search: {isOperator: true}}})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getOperatorData(operatorId?: String): Observable<{nbProjectsToValidate: number; nbProjectsToTreat: number; }> {
    return this._http.get('/dashboard/operator/' + operatorId || '')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
