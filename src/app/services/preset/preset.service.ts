import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PresetService {

  constructor(private _http: HttpClient) {
  }

  public create(presetObj: any): Observable<any> {
    return this._http.post('/preset', presetObj);
  }

  public get(id: string): Observable<any> {
    return this._http.get('/preset/' + id);
  }

  public getAll(config: any): Observable<any> {
    return this._http.get('/preset/', {params: config});
  }

  public remove(presetId: string): Observable<any> {
    return this._http.delete('/preset/' + presetId);
  }

  public save(presetId: string, presetObj: any): Observable<any> {
    return this._http.put('/preset/' + presetId, presetObj);
  }

}
