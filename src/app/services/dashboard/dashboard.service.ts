import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DashboardService {

  constructor(private _http: HttpClient) {}

  public getOperators(): Observable<{result: Array<User>}> {
    return this._http.get<{result: Array<User>}>('/user', {
      params: {
        $or: JSON.stringify([{roles: 'market-test-manager-umi'}, {roles: 'oper-supervisor'},]),
        fields: 'firstName,lastName,email,domain',
        sort: '{"firstName": 1}'
      }
    });
  }

  public getOperatorData(operatorId?: String) {
    return this._http.get('/dashboard/operator/' + operatorId || '');
  }

  public getNextDateSend(date: String) {
      return this._http.post('/dashboard/nextMails', {date: date});
  }

}
