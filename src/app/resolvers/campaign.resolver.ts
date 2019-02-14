/**
 * Created by bastien on 10/01/2018.
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { CampaignService } from '../services/campaign/campaign.service';
import { Campaign } from '../models/campaign';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const CAMPAIGN_KEY = makeStateKey('campaign');

@Injectable()
export class CampaignResolver implements Resolve<Campaign> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private campaignService: CampaignService,
              private state: TransferState) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Campaign> {
    if (this.state.hasKey(CAMPAIGN_KEY)) {
      const campaign = this.state.get<Campaign>(CAMPAIGN_KEY, null);
      this.state.remove(CAMPAIGN_KEY);
      return new Observable((observer) => {
        observer.next(campaign);
        observer.complete();
      });
    } else {
      const campaignId = route.paramMap.get('campaignId') || '';
      return this.campaignService.get(campaignId)
        .pipe(
          tap((campaign) => {
            if (isPlatformServer(this.platformId)) {
              this.state.set(CAMPAIGN_KEY, campaign as Campaign);
            }
          }),
          catchError(() => {
            return Observable.empty();
          })
        );
    }
  }
}
