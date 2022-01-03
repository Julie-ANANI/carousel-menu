/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Injectable } from '@angular/core';
import {LangEntryPipe} from '../../pipe/lang-entry/lang-entry.pipe';

@Injectable({
  providedIn: 'root'
})
export class LangEntryService extends LangEntryPipe {

  /**
   * from the list of the entry it will return the single entry based on the 'lang' param.
   * @param entry - actual entry list can be of any type, but it should have the lang property.
   * @param requested
   * @param lang - requested lang
   * @param returnDefault = true means if not find the entry in the given lang then return the entry at index 0
   */
  transform(entry: Array<any>, lang: string = 'en', requested: 'ENTRY' | 'INDEX' = 'ENTRY',  returnDefault: boolean = true): any {
    return super.transform(entry, lang, requested, returnDefault);
  }

}
