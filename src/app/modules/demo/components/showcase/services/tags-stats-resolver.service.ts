import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TagsService } from '../../../../../services/tags/tags.service';
import { TagStats } from '../../../../../models/tag-stats';

const SECTOR_TAGS_STATS_KEY = makeStateKey('sector-tags-stats');

const toCleanArray = (o) => o ? [].concat(o) : [];

@Injectable()
export class TagsStatsResolver implements Resolve<Array<TagStats>> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private tagsService: TagsService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<TagStats>> {
    const tags = toCleanArray(route.queryParams.tag);
    if (tags.length > 0) {
      if (this.state.hasKey(SECTOR_TAGS_STATS_KEY)) {
        // fetching stats in transfer state
        const tagsStats = this.state.get<Array<TagStats>>(SECTOR_TAGS_STATS_KEY, []);
        this.state.remove(SECTOR_TAGS_STATS_KEY);
        return new Observable((observer) => {
          observer.next(tagsStats);
          observer.complete();
        });
      } else {
        // requesting stats
        const statsObservables = tags.map((tag) => this.tagsService.getStats(tag));
        return forkJoin(statsObservables).pipe(
          tap((tagsStats) => {
            if (isPlatformServer(this.platformId)) {
              this.state.set(SECTOR_TAGS_STATS_KEY, tagsStats as Array<TagStats>);
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
      }
    } else {
      // no stats to fetch
      return new Observable((observer) => {
        observer.next([]);
        observer.complete();
      });
    }
  }
}
