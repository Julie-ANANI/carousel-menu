import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'ScrapeHTMLTags'
})

export class ScrapeHTMLTags implements PipeTransform {

  transform (value: any): any {

    const regex = /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gi;

    if (value) {
      return value.replace(regex, '');
    } else {
      return value;
    }

  }

}

