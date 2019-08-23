import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'FormatText'
})

export class FormatText implements PipeTransform {

  /**
   * Capitalize the first letter of a string.
   * @param value the string to be modified
   * @param wbw whether each word of the string is to be capitalized
   * or just the first one (false by default)
   */
  transform (value: string, wbw: boolean = false): string {

    if (value) {
      if(wbw) {
        let strings = value.split(/\s/);
        strings = strings.map(str => {
          return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
        });
        return strings.join(' ');
      } else {
        return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1);
      }
    } else {
      return value;
    }

  }

}

