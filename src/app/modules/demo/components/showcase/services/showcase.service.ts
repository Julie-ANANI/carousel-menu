import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../../../../../models/config';
import { Innovation } from '../../../../../models/innovation';
import { Showcase } from '../../../../../models/showcase';

@Injectable()
export class ShowcaseService {

  constructor(private _http: HttpClient) {
  }

  public create(showcaseObj: any): Observable<any> {
    return this._http.post('/showcase', showcaseObj);
  }

  public getAll(params: Config): Observable<{result: Array<Innovation>, _metadata: any}> {
    return this._http.get<{result: Array<Innovation>, _metadata: any}>('/showcase/', {params: params});
  }

  public get(id: string, config?: any): Observable<Showcase> {
    return this._http.get<Showcase>('/showcase/' + id, {params: config});
  }

  public save(id: string, showcaseObj: Showcase): Observable<any> {
    return this._http.put('/showcase/' + id, showcaseObj);
  }

  public remove(id: string): Observable<any> {
    return this._http.delete('/showcase/' + id);
  }

}
