/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Pipe, PipeTransform } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Pipe({
  name: 'langEntry'
})
export class LangEntryPipe implements PipeTransform {

  constructor(private _translateService: TranslateService) {
  }

  /**
   * from the list of the entry or type of Entry it will return the requested based on the 'lang' param.
   *
   * This pipe is also extended by the service 'LangEntryService' to use in the component.ts file so
   * if you make changes in the param do there also.
   *
   * @param value - actual entry it can be of type or Array<any> but in that case it should have the lang property.
   * @param requested - the label or value you want
   * @param lang - requested lang
   * @param returnDefault = true means if not find the entry in the given lang then return the default entry
   */
  transform(value: any, requested: string, lang = 'en', returnDefault = false): any {
    if (!value || !requested) return '';

    if (Array.isArray(value) && !!value.length) {
      const entry = value.find((_value) => _value.lang === lang);
      return !!entry ? requested === 'FULL_ENTRY' ? entry : entry[requested] : returnDefault ? value[0][requested] : '';
    }

    if (value[requested] && value[requested][lang]) {
      return value[requested] && value[requested][lang];
    }

    if (returnDefault) {
      if (lang !== this._translateService.defaultLang && value[requested][this._translateService.defaultLang]) {
        return value[requested][this._translateService.defaultLang];
      } else {
        for (const a in value[requested]) {
          if(value[requested][a]) return value[requested][a];
        }
        return '';
      }
    }
  }

}
