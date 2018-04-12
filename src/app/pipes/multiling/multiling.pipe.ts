import { Pipe, PipeTransform } from '@angular/core';
import { Multiling } from '../../models/multiling';

@Pipe({
  name: 'multiling'
})
export class MultilingPipe implements PipeTransform {

  transform(value: Multiling, lang: string = 'en'): string {
    if (value && value[lang]) {
      return value[lang];
    } else if (value) {
      if (lang !== 'en' && value['en']) {
        return value['en'];
      } else {
        for (var a in value) return value[a];
      }
    } else {
      return '';
    }
  }

}
