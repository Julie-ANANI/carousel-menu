/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonService } from '../common/common.service';

@Injectable({providedIn: 'root'})
export class SearchService {

  constructor(private _http: HttpClient,
              private _commonService: CommonService) {
  }

  public search(params: any): Observable<any> {
    return this._http.post('/search/searchPros', params);
  }

  public cat(campaignId: string, requests: string, starProfiles: number): Observable<any> {
    return this._http.post('/search/cat', {campaignId: campaignId, keywords: requests, starProfiles: starProfiles});
  }

  public metadataSearch(keywords: string, user: string): Observable<any> {
    const query = {
      params: JSON.stringify({keywords: keywords, user: user}),
      path: '/search/metadata'
    };
    return this._http.get('/search/get', {params: query});
  }

  public saveMetadataRequest(requestId: any): Observable<any> {
    const query = {
      path: `/metadataRequest/${requestId}/keep`
    };
    return this._http.get('/search/get', {params: query});
  }

  public getRequest(requestId: string): Observable<any> {
    const query = {
      path: '/request/' + requestId,
      params: '{"fields":"status, flag, mailRequest, request, entity, _id, keywords, oldKeywords, country, language, campaign, profiles, automated"}'
    };

    return this._http.get('/search/get', {params: query});
  }

  public getMetadataRequest(requestId: string): Observable<any> {
    return this._http.get('/search/get', {params: {path: '/metadataRequest/' + requestId}});
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

  public getMetadataRequests(config: any): Observable<any> {
    config = this._commonService.configToString(config);
    return this._http.get('/search/queryRessourceAPI/metadatarequest', {params: config});
  }

  public searchMails(config: any): Observable<any> {
    return this._http.post('/search/searchMails', config);
  }

  public export(requestId: string, config: any): Observable<any> {
    if (config.query) {
      Object.keys(config.query).forEach(key => {
        try {
          config.query[key] = JSON.parse(config.query[key]);
        } catch (e) {}
      });
    }
    const query = {
      path: '/request/' + requestId + '/export/people',
      data: config
    };
    return this._http.post('/search/export', query);
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

  public pauseModule(): Observable<any> {
    const query = {
      path: '/search/people/pause',
    };
    return this._http.get('/search/get', {params: query});
  }

  public relaunchMailRequests(): Observable<any> {
    const query = {
      path: '/search/mail/relaunch',
    };
    return this._http.get('/search/get', {params: query});
  }

  public computerAidedTargeting(keywords: string[]): Observable<any> {
    return this._http.post('/search/cat', {keywords});
  }

  public updateCatStats(usedRequests: number): Observable<any> {
    const params: any = {usedRequests: usedRequests};
    const query = {
      params: JSON.stringify(params),
      path: '/stats/cat'
  };
    return this._http.get('/search/get', {params: query});
  }

  public getProKeywords(personId: string) {
    const query = {
      path: `/person/${personId}/getKeywords`,
    };
    return this._http.get('/search/get', {params: query});
  }

  public cancelManyRequests(requestIds: Array<String>): Observable<any> {
    const query = {
      params: JSON.stringify({requestIds: requestIds}),
      path: '/request/cancel/many'
    };
    return this._http.get('/search/get', {params: query});
  }

  public stopManyRequests(requestIds: Array<String>): Observable<any> {
    const query = {
      params: JSON.stringify({requestIds: requestIds}),
      path: '/request/stop/many'
    };
    return this._http.get('/search/get', {params: query});
  }

  public queueManyRequests(requestIds: Array<String>): Observable<any> {
    const query = {
      params: JSON.stringify({requestIds: requestIds}),
      path: '/request/queue/many'
    };
    return this._http.get('/search/get', {params: query});
  }
/*
  public updateDatabase() {
    const query = {
      path: `/request/update/database`,
    };
    return this._http.get('/search/get', {params: query});
  }
  */
  public loadRequestIndex(): Observable<any> {
    const query = {
      path: '/index/create'
    };
    return this._http.get('/search/get', {params: query});
  }

  public importList(file:File, fileName: string): Observable<any> {
    const formData = new FormData();
    fileName = fileName || "Recherche de mails";
    formData.append('file', file, fileName);
    return this._http.post('/search/mailsList/', formData);
  }
}
