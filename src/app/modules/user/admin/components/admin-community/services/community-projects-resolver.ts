import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { AdvSearchService } from '../../../../../../services/advsearch/advsearch.service';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Response } from '../../../../../../models/response';
import { Config } from '@umius/umi-common-component/models';

const COMMUNITY_PROJECTS_KEY = makeStateKey('community_projects');

@Injectable({providedIn: 'root'})
export class CommunityProjectsResolver implements Resolve<Response> {

  private _config: Config = {
    fields: '',
    limit: '',
    offset: '',
    search: '{}',
    status: "EVALUATING",
    sort: '{ "created": -1 }'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _advSearchService: AdvSearchService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(COMMUNITY_PROJECTS_KEY)) {
      const projects = this._transferState.get<Response>(COMMUNITY_PROJECTS_KEY, null);
      this._transferState.remove(COMMUNITY_PROJECTS_KEY);

      return new Observable((observer) => {
        observer.next(projects);
        observer.complete();
      });

    } else {
      return this._advSearchService.getCommunityInnovations(this._config).pipe(
        tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(COMMUNITY_PROJECTS_KEY, response as Response);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }


  get config(): Config {
    return this._config;
  }


}


