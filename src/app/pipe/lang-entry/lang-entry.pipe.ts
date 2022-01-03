/**
 * Created by Abhishek SAINI on 03-01-2022
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'langEntry'
})
export class LangEntryPipe implements PipeTransform {

  /**
   * from the list of the entry it will return the single entry based on the 'lang' param.
   *
   * This pipe is also extended by the service 'LangEntryService' to use in the component.ts file so
   * if you make changes in the param do there also.
   *
   * @param entry - actual entry list can be of any type, but it should have the lang property.
   * @param requested
   * @param lang - requested lang
   * @param returnDefault = true means if not find the entry in the given lang then return the entry at index 0
   */
  transform(entry: Array<any>, lang = 'en', requested: 'ENTRY' | 'INDEX' = 'ENTRY', returnDefault = true): any {
    if (!entry.length) return '';

    const _entryIndex = entry.findIndex((_entry) => _entry.lang === lang);

    switch (requested) {
      case 'ENTRY':
        return _entryIndex !== -1 ? entry[_entryIndex] : returnDefault ? entry[0] : '';
      case 'INDEX':
        return _entryIndex !== -1 ? _entryIndex : returnDefault ? 0 : '';
      default:
        return '';
    }
  }

}
