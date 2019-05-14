import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { TagsService } from '../../../../../services/tags/tags.service';
import { Tag } from '../../../../../models/tag';

const SECTOR_TAGS_KEY = makeStateKey('sector-tags');

@Injectable()
export class TagsResolver implements Resolve<Array<Tag>> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private tagsService: TagsService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Tag>> {
    if (this.state.hasKey(SECTOR_TAGS_KEY)) {
      const tags = this.state.get<Array<Tag>>(SECTOR_TAGS_KEY, null);
      this.state.remove(SECTOR_TAGS_KEY);
      return new Observable((observer) => {
        observer.next(tags);
        observer.complete();
      });
    } else {
      return this.tagsService.getAll({search: '{"type":"SECTOR"}'})
        .pipe(
          map((tags: any) => tags.result),
          tap((tags) => {
            if (isPlatformServer(this.platformId)) {
              this.state.set(SECTOR_TAGS_KEY, tags as Array<Tag>);
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
    }
  }
}
