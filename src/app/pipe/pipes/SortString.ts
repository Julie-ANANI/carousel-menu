/***
 * this pipe is to sort the string.
 * @param tags
 * @param userLang
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'SortString'
})

export class SortString implements PipeTransform {

  transform (value: Array<string>) {
    let arrayToSort = [];

    if (value && value.length > 0) {
      arrayToSort = value.sort((a: string, b: string) => {
        return a.localeCompare(b);
      });
    }

    return arrayToSort;

  }

}

