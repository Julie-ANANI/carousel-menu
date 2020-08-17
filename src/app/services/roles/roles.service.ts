/**
 * Created by juan on 06/07/2020.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class RolesService {

  constructor(private _http: HttpClient) {
  }

  public get(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get('/roles', {params: config});
  }

}
