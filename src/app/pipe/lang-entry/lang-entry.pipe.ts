/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Pipe } from '@angular/core';
import {LangEntryService} from '../../services/lang-entry/lang-entry.service';
import { UmiusLangEntryPipe } from '@umius/umi-common-component';

/**
 * UmiusLangEntryPipe:
 * 1. transform(value: any, requested: string, lang = 'en', returnDefault = false): any;
 */

@Pipe({
  name: 'langEntry'
})
export class LangEntryPipe extends UmiusLangEntryPipe {

  constructor(protected _langEntryService: LangEntryService) {
    super(_langEntryService);
  }

}
