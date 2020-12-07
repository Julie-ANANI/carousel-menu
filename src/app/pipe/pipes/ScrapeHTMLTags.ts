import {Pipe, PipeTransform} from '@angular/core';
const he = require('he');

@Pipe({
  name: 'ScrapeHTMLTags'
})

export class ScrapeHTMLTags implements PipeTransform {

  transform(value: any): any {
      const tagRegex = /<[^>]*>?/gm;
      return value && he.decode(value).replace(tagRegex, '');
  }

}

