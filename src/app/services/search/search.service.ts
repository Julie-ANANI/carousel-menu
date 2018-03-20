/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SearchService {

  constructor(private _http: Http) {
  }

  public search(params: any): Observable<any> {
    return this._http.get('/search/search', {params: params})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getRequest(requestId: string): Observable<any> {
    const query = {
      path: '/request/' + requestId,
      params: {
        fields: 'status, flag, mailRequest, request, entity, _id, keywords, country, language, campaign, profiles, automated'
      }
    };

    return this._http.get('/search/get', {params:query})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public stopRequest(requestId: string): Observable<any> {
    return this._http.get('/search/stop', {params: {id: requestId}})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public cancelRequest(requestId: string, cancel: boolean): Observable<any> {
    return this._http.get('/search/cancel', {params: {id: requestId, cancel: cancel}})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getPros(config: any, requestId: string): Observable<any> {
    return this._http.get('/search/queryRessourceAPI/request/' + requestId + '/person', {params:config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getEmailStats(daysCount: number): Observable<any> {
    const query = {
      params: {daysCount: daysCount},
      path: '/stats/email'
    };
    return this._http.get('/search/get', {params: query})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getRequests(config: any): Observable<any> {
    return this._http.get('/search/queryRessourceAPI/request', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public searchMails(config: any): Observable<any> {
    return this._http.post('/search/searchMails', config)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public export(requestId: string, config: any): Observable<any> {
    const query = {
      path: '/request/' + requestId + '/export/people',
      data: config
    };
    return this._http.get('/search/export', {params: query})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
