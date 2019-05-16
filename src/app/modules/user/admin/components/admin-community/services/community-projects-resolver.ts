import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { AdvSearchService } from '../../../../../../services/advsearch/advsearch.service';

const PROJECTS_KEY = makeStateKey('projects');

@Injectable()
export class CommunityProjectsResolver implements Resolve<Array<any>> {

  config = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    status: "EVALUATING",
    sort: '{"created":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _advSearchService: AdvSearchService,
              private _transferState: TransferState) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<any>> {

  }

}
