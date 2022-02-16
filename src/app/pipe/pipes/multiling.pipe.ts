import { Injectable, Pipe } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {UmiusMultilingPipe} from '@umius/umi-common-component/pipe/multiling/multiling.pipe';

/**
 * UmiusMultilingPipe:
 *
 * 1. transform(value: UmiusMultilingInterface, lang: string = this._translateService.currentLang, returnDefault = true): string;
 */

@Pipe({
  name: 'multiling'
})
@Injectable({ providedIn: 'root' })
export class MultilingPipe extends UmiusMultilingPipe {

  constructor(protected translate: TranslateService) {
    super(translate);
  }

}
