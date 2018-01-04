import { Injectable } from '@angular/core';
import { Http, Response } from '../http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class PresetService {

  constructor(private _http: Http) {
  }

  public create(presetObj: any): Observable<any> {
    return this._http.post('/preset', presetObj)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public get(id: string): Observable<any> {
    return this._http.get('/preset/' + id)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/preset/', {params: config})
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public remove(presetId: string): Observable<any> {
    return this._http.delete('/preset/' + presetId)
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }

  public save(presetId: string, presetObj: any): Observable<any> {
    return this._http.put('/preset/' + presetId, { presetObj: presetObj })
      .map((res: Response) => res.json())
      .catch((error: Response) => Observable.throw(error.text()));
  }
}
