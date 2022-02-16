import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {UmiusConfigService, UmiusLocalStorageService} from '@umius/umi-common-component';

/**
 * UmiusConfigService functions:
 *
 * 1. configLimit(selector: string): string;
 */

@Injectable({providedIn: 'root'})
export class ConfigService extends UmiusConfigService {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              protected _umiusLocalStorageService: UmiusLocalStorageService) {
    super(_platformId, _umiusLocalStorageService);
  }

}
