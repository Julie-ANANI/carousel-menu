import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class IndexService {

  constructor(private _http: HttpClient) { }

  public getWholeSet(config: { type: string, fields?: Array<string>, filterBy?: any }): Observable<any> {
    return this._http.post('/index/getWholeSet', { query: config });
  }

  public loadIndex(resourceType: string): Observable<any> {
    return this._http.get('/index/create/' + resourceType);
  }

  public loadMappings(): Observable<any> {
    return this._http.get('/index/createMappings');
  }

  public resetElasticsearch(): Observable<any> {
    return this._http.delete('/index/destroyAll');
  }

  public launchIndexMan(): Observable<any> {
    return this._http.delete('/index/loadIndexData');
  }

  public find(query: string, resource: string): Observable<any> {
    return this._http.post('/index/searchIndex', {query: {resources: [resource], data: query}});
  }

}
