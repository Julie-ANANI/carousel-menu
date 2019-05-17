import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { AdvSearchService } from '../../../../../../services/advsearch/advsearch.service';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';

const PROJECTS_KEY = makeStateKey('projects');

@Injectable()
export class CommunityProjectsResolver implements Resolve<Array<any>> {

  private _config = {
    fields: '',
    limit: '',
    offset: '',
    search: '{}',
    status: "EVALUATING",
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _advSearchService: AdvSearchService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<any> {

    if (this._transferState.hasKey(PROJECTS_KEY)) {
      const projects = this._transferState.get<any>(PROJECTS_KEY, null);
      this._transferState.remove(PROJECTS_KEY);

      return new Observable((observer) => {
        observer.next(projects);
        observer.complete();
      });

    } else {
      return this._advSearchService.getCommunityInnovations(this._config).pipe(
        tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(PROJECTS_KEY, response as any);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }


  get config(): { search: string; offset: string; limit: string; sort: string; fields: string; status: string } {
    return this._config;
  }


}


