/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable()
export class SearchService {

  constructor(private _http: HttpClient,
              private _commonService: CommonService) {
  }

  public search(params: any): Observable<any> {
    return this._http.post('/search/searchPros', params);
  }

  public getRequest(requestId: string): Observable<any> {
    const query = {
      path: '/request/' + requestId,
      params: '{"fields":"status, flag, mailRequest, request, entity, _id, keywords, oldKeywords, country, language, campaign, profiles, automated"}'
    };

    return this._http.get('/search/get', {params: query});
  }

  public stopRequest(requestId: string): Observable<any> {
    return this._http.get('/search/stop', {params: {id: requestId}});
  }

  public cancelRequest(requestId: string, cancel: boolean): Observable<any> {
    return this._http.get('/search/cancel', {params: {id: requestId, cancel: JSON.stringify(cancel)}});
  }

  public getPros(config: {[header: string]: string | string[]}, requestId: string): Observable<any> {
    config = this._commonService.configToString(config);
    return this._http.get('/search/queryRessourceAPI/request/' + requestId + '/person', {params: config});
  }

  public getEmailStats(daysCount: number): Observable<any> {
    const query = {
      params: JSON.stringify({daysCount: daysCount}),
      path: '/stats/email'
    };
    return this._http.get('/search/get', {params: query});
  }

  public dailyStats(): Observable<any> {
    return this._http.get('/search/get', {params: {path: '/stats/day'}});
  }

  public getRequests(config: {[header: string]: string | string[]}): Observable<any> {
    config = this._commonService.configToString(config);
    return this._http.get('/search/queryRessourceAPI/request', {params: config});
  }

  public searchMails(config: any): Observable<any> {
    return this._http.post('/search/searchMails', config);
  }

  public export(requestId: string, config: string): Observable<any> {
    const query = {
      path: '/request/' + requestId + '/export/people',
      data: config
    };
    return this._http.get('/search/export', {params: query});
  }

  public getCountriesSettings(): Observable<any> {
    const query = {
      path: '/countries',
    };
    return this._http.get('/search/get', {params: query});
  }

  public relaunchRequests(): Observable<any> {
    const query = {
      path: '/search/people/relaunch',
    };
    return this._http.get('/search/get', {params: query});
  }

  public relaunchMailRequests(): Observable<any> {
    const query = {
      path: '/search/mail/relaunch',
    };
    return this._http.get('/search/get', {params: query});
  }
}
