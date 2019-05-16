/***
 * this pipe is to sort the tags.
 * @param tags
 * @param userLang
 */

import { Pipe, PipeTransform } from '@angular/core';
import { Tag } from '../../models/tag';
import { MultilingPipe } from './multiling.pipe';

@Pipe ({
  name: 'SortTags'
})

export class SortTags implements PipeTransform {

  constructor(private multiling: MultilingPipe) {}

  transform (tags: Array<Tag>, userLang: string) {
    let sortTags = [];

    if (tags && tags.length > 0) {
      sortTags = tags.sort((a: Tag, b: Tag) => {
        const labelA = this.multiling.transform(a.label, userLang).toLowerCase();
        const labelB =  this.multiling.transform(b.label, userLang).toLowerCase();
        return labelA.localeCompare(labelB);
      });
    }

    return sortTags;
  }

}

