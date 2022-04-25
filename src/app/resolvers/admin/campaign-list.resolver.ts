/**
 * Created by Wei WANG on 25/04/2022.
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { Campaign } from '../../models/campaign';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { InnovationService } from "../../services/innovation/innovation.service";

const CAMPAIGN_LIST_KEY = makeStateKey('campaign-list');

@Injectable({providedIn: 'root'})
export class CampaignListResolver implements Resolve<Array<Campaign>> {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private innovationService: InnovationService,
              private state: TransferState) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Campaign>> {
    if (this.state.hasKey(CAMPAIGN_LIST_KEY)) {
      const campaigns = this.state.get<Array<Campaign>>(CAMPAIGN_LIST_KEY, null);
      this.state.remove(CAMPAIGN_LIST_KEY);
      return new Observable((observer) => {
        observer.next(campaigns);
        observer.complete();
      });
    } else {
      const uri = state.url.split('/') || [];
      if(uri.length > 5){
        const innovationId =  uri[5];
        return this.innovationService.campaigns(innovationId)
          .pipe(
            tap((response: any) => {
              if (isPlatformServer(this.platformId)) {
                this.state.set(CAMPAIGN_LIST_KEY, response as Array<Campaign>);
              }
            }),
            catchError(() => {
              return EMPTY;
            })
          );
      }else {
        return  EMPTY;
      }
    }
  }
}
