/*
    This is to calculate the remaining characters.
 */

import {Pipe, PipeTransform} from '@angular/core';

@Pipe ({
  name: 'characterCountdown',
  pure: false
})

export class CharacterCountdown implements PipeTransform {
  transform(text: any, args: number) {
    const maxLength = args || 0;
    if (typeof text === 'number') {
      const length = text;
      return maxLength - length;
    } else if (typeof text === 'string') {
      const length = text.length;
      return maxLength - length;
    } else {
      return args;
    }
  }

}

