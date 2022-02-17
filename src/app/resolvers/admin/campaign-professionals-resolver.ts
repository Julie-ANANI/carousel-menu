import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { makeStateKey, TransferState } from '@angular/platform-browser';
import { EMPTY, Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { isPlatformServer } from '@angular/common';
import { Response } from '../../models/response';
import { ProfessionalsService } from '../../services/professionals/professionals.service';
import {UmiusConfigInterface, UmiusConfigService} from '@umius/umi-common-component';

const CAMPAIGN_PROFESSIONALS_KEY = makeStateKey('campaign_professionals');

@Injectable({providedIn: 'root'})
export class CampaignProfessionalsResolver implements Resolve<Response> {

  private _config: UmiusConfigInterface = {
    fields: 'language firstName lastName company email emailConfidence country jobTitle personId messages campaigns',
    limit: '10',
    offset: '0',
    search: '{}',
    sort: '{ "created": -1 }'
  };

  constructor(@Inject(PLATFORM_ID) private _platformId: Object,
              private _transferState: TransferState,
              private _professionalService: ProfessionalsService,
              private _configService: UmiusConfigService) { }

  resolve(activatedRouteSnapshot: ActivatedRouteSnapshot, routerStateSnapshot: RouterStateSnapshot): Observable<Response> {

    if (this._transferState.hasKey(CAMPAIGN_PROFESSIONALS_KEY)) {
      const professionals = this._transferState.get<Response>(CAMPAIGN_PROFESSIONALS_KEY, null);
      this._transferState.remove(CAMPAIGN_PROFESSIONALS_KEY);

      return new Observable((observer) => {
        observer.next(professionals);
        observer.complete();
      });

    } else {
      this._config.campaigns = activatedRouteSnapshot.paramMap.get('campaignId') || '';
      this._config.limit = this._configService.configLimit('admin-campaign-pros-limit');

      return this._professionalService.getAll(this._config)
        .pipe(
          tap((response) => {
          if (isPlatformServer(this._platformId)) {
            this._transferState.set(CAMPAIGN_PROFESSIONALS_KEY, response as Response);
          }
        }),
        catchError(() => {
          return EMPTY;
        })
      )
    }

  }

  get config(): UmiusConfigInterface {
    return this._config;
  }

}


