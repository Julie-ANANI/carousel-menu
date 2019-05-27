import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Tag } from '../models/tag';
import { TagsService } from '../services/tags/tags.service';

const TAGS_KEY = makeStateKey('tagsSector');

@Injectable()
export class TagsSectorResolver implements Resolve<Array<Tag>> {

  private _config = {
    limit: '0',
    offset: '0',
    search: '{"type":"SECTOR"}',
    sort: '{"label":-1}'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _tagService: TagsService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Array<Tag>> {

    if (this._transferState.hasKey(TAGS_KEY)) {
      const tags = this._transferState.get<Array<Tag>>(TAGS_KEY, null);
      this._transferState.remove(TAGS_KEY);

      return new Observable((observer) => {
        observer.next(tags);
        observer.complete();
      });

    } else {
      return this._tagService.getAll(this._config).pipe(
        map((response: any) => response.result),
        tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(TAGS_KEY, response as Array<Tag>);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }


  get config(): any {
    return this._config;
  }


}


