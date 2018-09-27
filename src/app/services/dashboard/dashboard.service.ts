import { Injectable } from '@angular/core';
import { Http, Response } from '../http.service';
import { Observable, throwError } from 'rxjs';
import { User } from '../../models/user.model';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class DashboardService {

  constructor(private _http: Http) {}

  public getOperators(): Observable<{result: Array<User>}> {
    return this._http.get('/user', {params: {search: {isOperator: true}}})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getOperatorData(operatorId?: String): Observable<{nbProjectsToValidate: number; nbProjectsToTreat: number; }> {
    return this._http.get('/dashboard/operator/' + operatorId || '')
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getNextDateSend(date: String): Observable<any> {
      return this._http.post('/dashboard/nextMails', {date: date})
        .pipe(
          map((res: Response) => res.json()),
          catchError((error: Response) => throwError(error.text()))
        );
  }

}
