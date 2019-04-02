import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'ScrapeHTMLTags'
})

export class ScrapeHTMLTags implements PipeTransform {

  decodeEntities (str: string) {
    const el = document.createElement('textarea');

    el.innerHTML = str
      .replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '')
      .replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');

    return el.value;
  }

  transform (value: any): any {

    const regex = /<\/?[\w\s="/.':;#-\/?]+>/gi;

    value = this.decodeEntities(value);

    if (value) {
      return value.replace(regex, "");
    } else {
      return value;
    }

  }

}

