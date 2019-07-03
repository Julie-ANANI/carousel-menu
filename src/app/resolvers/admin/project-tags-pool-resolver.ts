import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Response } from '../../models/response';
import { TagsService } from '../../services/tags/tags.service';

const PROJECT_TAGS_POOL_KEY = makeStateKey('project_tags_pool');

@Injectable()
export class ProjectTagsPoolResolver implements Resolve<Response> {

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _tagService: TagsService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(PROJECT_TAGS_POOL_KEY)) {
      const tagsPool = this._transferState.get<Response>(PROJECT_TAGS_POOL_KEY, null);
      this._transferState.remove(PROJECT_TAGS_POOL_KEY);

      return new Observable((observer) => {
        observer.next(tagsPool);
        observer.complete();
      });

    } else {
      const projectId = activatedRouteSnapshot.paramMap.get('projectId') || '';

      return this._tagService.getTagsFromPool(projectId)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(PROJECT_TAGS_POOL_KEY, response as Response);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }

}


