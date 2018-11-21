/**
 * Created by bastien on 10/01/2018.
 */
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CampaignService } from '../services/campaign/campaign.service';

@Injectable()
export class CampaignResolver implements Resolve<any> {
  constructor(
    private _campaignService: CampaignService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    return this._campaignService.get(route.params.campaignId);
  }
}
