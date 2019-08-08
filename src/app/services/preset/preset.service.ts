import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

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

  public getAll(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get('/preset/', {params: config});
  }

  public export(): string {
    return environment.apiUrl + '/preset/';
  }

  public import(file:File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, "import_presets");
    return this._http.post('/preset/import/', formData);
  }

  public remove(presetId: string): Observable<any> {
    return this._http.delete('/preset/' + presetId);
  }

  public save(presetId: string, presetObj: any): Observable<any> {
    return this._http.put('/preset/' + presetId, presetObj);
  }

}
