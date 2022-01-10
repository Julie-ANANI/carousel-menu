/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Pipe, PipeTransform } from '@angular/core';
import {LangEntryService} from '../../services/lang-entry/lang-entry.service';

@Pipe({
  name: 'langEntry'
})
export class LangEntryPipe implements PipeTransform {

  constructor(private _langEntryService: LangEntryService) {
  }

  /**
   * from the list of the entry or type of Entry it will return the requested based on the 'lang' param.
   *
   * @param value - actual entry it can be of type or Array<any> but in that case it should have the lang property.
   * @param requested - the label or value you want
   * @param lang - requested lang
   * @param returnDefault = true means if not find the entry in the given lang then return the default entry
   */
  transform(value: any, requested: string, lang = 'en', returnDefault = false): any {
    return this._langEntryService.transform(value, requested, lang, returnDefault);
  }

}
