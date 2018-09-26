/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class SearchService {

  constructor(private _http: Http) {
  }

  public search(params: any): Observable<any> {
    return this._http.post('/search/searchPros', params)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getRequest(requestId: string): Observable<any> {
    const query = {
      path: '/request/' + requestId,
      params: {
        fields: 'status, flag, mailRequest, request, entity, _id, keywords, oldKeywords, country, language, campaign, profiles, automated'
      }
    };

    return this._http.get('/search/get', {params: query})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public stopRequest(requestId: string): Observable<any> {
    return this._http.get('/search/stop', {params: {id: requestId}})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public cancelRequest(requestId: string, cancel: boolean): Observable<any> {
    return this._http.get('/search/cancel', {params: {id: requestId, cancel: cancel}})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getPros(config: any, requestId: string): Observable<any> {
    return this._http.get('/search/queryRessourceAPI/request/' + requestId + '/person', {params:config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getEmailStats(daysCount: number): Observable<any> {
    const query = {
      params: {daysCount: daysCount},
      path: '/stats/email'
    };
    return this._http.get('/search/get', {params: query})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public dailyStats(): Observable<any> {
    return this._http.get('/search/get', {params: {path: '/stats/day'}})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getRequests(config: any): Observable<any> {
    return this._http.get('/search/queryRessourceAPI/request', {params: config})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public searchMails(config: any): Observable<any> {
    return this._http.post('/search/searchMails', config)
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public export(requestId: string, config: any): Observable<any> {
    const query = {
      path: '/request/' + requestId + '/export/people',
      data: config
    };
    return this._http.get('/search/export', {params: query})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public getCountriesSettings(): Observable<any> {
    const query = {
      path: '/countries',
    };
    return this._http.get('/search/get', {params: query})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public relaunchRequests(): Observable<any> {
    const query = {
      path: '/search/people/relaunch',
    };
    return this._http.get('/search/get', {params: query})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }

  public relaunchMailRequests(): Observable<any> {
    const query = {
      path: '/search/mail/relaunch',
    };
    return this._http.get('/search/get', {params: query})
      .pipe(
        map((res: Response) => res.json()),
        catchError((error: Response) => throwError(error.text()))
      );
  }
}
