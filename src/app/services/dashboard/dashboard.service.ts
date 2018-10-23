import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable()
export class DashboardService {

  constructor(private _http: HttpClient) {}

  public getOperators(): Observable<{result: Array<User>}> {
    return this._http.get<{result: Array<User>}>('/user', {params: {search: JSON.stringify({isOperator: true})}});
  }

  public getOperatorData(operatorId?: String) {
    return this._http.get('/dashboard/operator/' + operatorId || '');
  }

  public getNextDateSend(date: String) {
      return this._http.post('/dashboard/nextMails', {date: date});
  }

}
