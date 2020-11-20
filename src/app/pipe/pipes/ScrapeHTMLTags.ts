import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'ScrapeHTMLTags'
})

export class ScrapeHTMLTags implements PipeTransform {

  transform (value: any): any {

    const regex = /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gi;
    const tagRegex = /<[^>]*>?/gm;
    const nbspRegex = /&nbsp;/gi;

    if (value) {
      return value.replace(regex, '').replace(tagRegex, '').replace(nbspRegex, '');
    } else {
      return value;
    }

  }

}

