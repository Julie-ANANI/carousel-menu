import { Injectable } from '@angular/core';
import { Http } from '../http.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable()
export class DashboardService {

  constructor(private _http: Http) {}

  public getOperators(): Observable<{result: Array<User>}> {
    return this._http.get('/user', {params: {search: JSON.stringify({isOperator: true})}});
  }

  public getOperatorData(operatorId?: String): Observable<{nbProjectsToValidate: number; nbProjectsToTreat: number; }> {
    return this._http.get('/dashboard/operator/' + operatorId || '');
  }

  public getNextDateSend(date: String): Observable<any> {
      return this._http.post('/dashboard/nextMails', {date: date});
  }

}
