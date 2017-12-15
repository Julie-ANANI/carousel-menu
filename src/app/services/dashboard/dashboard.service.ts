import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DashboardService {

  constructor(private _http: Http) {}

  public getOperators(): Observable<any> {
    return this._http.get('/user', {params: {search: {isOperator: true}}})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getOperatorData(operatorId?: String): Observable<any> {
    return this._http.get('/dashboard/operator/' + operatorId || '')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getStatistics(): Observable<any> {
    return this._http.get('/dashboard/statistics')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getInPreparationProjects(): Observable<any> {
    return this._http.get('/dashboard/projects/preparation', {params: {limit: 5,  search: {/*$orderBy: {updated: -1},*/ $or: [{status: 'EDITING'}, {status: 'SUBMITTED'}]}}})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getLaunchedProjects(): Observable<any> {
    return this._http.get('/dashboard/projects')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getFinishedProjects(): Observable<any> {
    return this._http.get('/dashboard/projects')
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

}
