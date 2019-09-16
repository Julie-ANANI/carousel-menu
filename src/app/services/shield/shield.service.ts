/*
* Created by juandavidcruzgomez on 2019-09-16
*/

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class ShieldService {

  constructor(private _http: HttpClient) {
  }

  public get(id: string, config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get(`/shield/${id?id:''}`, config);
  }


}