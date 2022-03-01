import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CampaignService } from '../../services/campaign/campaign.service';
import { Response } from '../../models/response';
import {UmiusConfigInterface, UmiusConfigService} from '@umius/umi-common-component';

const CAMPAIGN_ANSWERS_KEY = makeStateKey('campaign_answers');

@Injectable({providedIn: 'root'})
export class CampaignAnswersResolver implements Resolve<Response> {

  private _config: UmiusConfigInterface = {
    fields: '',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private _campaignService: CampaignService,
              private _configService: UmiusConfigService,
              private _transferState: TransferState) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {
    if (this._transferState.hasKey(CAMPAIGN_ANSWERS_KEY)) {
      const campaign = this._transferState.get<Response>(CAMPAIGN_ANSWERS_KEY, null);
      this._transferState.remove(CAMPAIGN_ANSWERS_KEY);
      return new Observable((observer) => {
        observer.next(campaign);
        observer.complete();
      });
    } else {
      const campaignId = activatedRouteSnapshot.paramMap.get('campaignId') || '';
      this._config.limit = this._configService.configLimit('admin-campaign-answers-limit');

      return this._campaignService.getAnswers(campaignId)
        .pipe(
          tap((response) => {
            if (isPlatformServer(this.platformId)) {
              this._transferState.set(CAMPAIGN_ANSWERS_KEY, response as Response);
            }
          }),
          catchError(() => {
            return EMPTY;
          })
        );
    }
  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

}
