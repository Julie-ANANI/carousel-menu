/**
 * Created by bastien on 10/01/2018.
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { SearchService } from '../services/search/search.service';
import { catchError, tap } from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class RequestResolver implements Resolve<any> {
  constructor(
    private _searchService: SearchService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._searchService.getRequest(route.params.requestId)
      .pipe(
        tap((response: any) => {
        }),
        catchError(() => {
          return EMPTY;
        })
      );
  }
}
