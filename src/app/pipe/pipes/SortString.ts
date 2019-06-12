/***
 * this pipe is to sort the string.
 * @param tags
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'SortString'
})

export class SortString implements PipeTransform {

  transform (value: Array<string>): Array<string> {
    if (value && value.length > 0) {
      return value.sort((a: string, b: string) => {
        return a.localeCompare(b);
      });
    }
    return [];
  }

}

