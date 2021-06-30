/*
    This is to calculate the remaining characters.
 */

import {Pipe, PipeTransform} from '@angular/core';
import {ScrapeHTMLTags} from './ScrapeHTMLTags';

@Pipe ({
  name: 'characterCountdown',
  pure: false
})

export class CharacterCountdown implements PipeTransform {

  transform(text: any, maxLength = 0) {

    if (typeof text === 'number') {
      return maxLength - text;
    } else if (typeof text === 'string') {
      text = new ScrapeHTMLTags().transform(text.replace(/<img .*?>/g, ''));
      return maxLength - text.length;
    } else {
      return maxLength;
    }
  }

}

