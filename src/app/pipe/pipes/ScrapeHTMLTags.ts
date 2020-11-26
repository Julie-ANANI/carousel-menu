import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'ScrapeHTMLTags'
})

export class ScrapeHTMLTags implements PipeTransform {

  transform (value: any): any {

    const regex = /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gi;
    const tagRegex = /<[^>]*>?/gm;
    const symbolsUnicodeRegex = /&[#0-9a-zA-Z]\w+;/gi;

    if (value) {
      return value.replace(regex, '').replace(tagRegex, '').replace(symbolsUnicodeRegex, '');
    } else {
      return value;
    }

  }

}

