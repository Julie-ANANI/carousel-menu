/**
 * Created by bastien on 19/12/2017.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AdvSearchService {

  private _base: string = "/advsearch";

  constructor(private _http: HttpClient) {
  }

  /////////////// Advanced Search ///////////////
  // The idea of this piece is to use a new
  ///////////////////////////////////////////////

  public advsearch(config: {[header: string]: string | string[]}): Observable<any> {
    return this._http.get(`${this._base}/`, {params: config});
  }
}
