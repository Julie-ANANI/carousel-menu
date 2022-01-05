import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Multiling } from '../../models/multiling';

@Pipe({
  name: 'multiling'
})

@Injectable({ providedIn: 'root' })
export class MultilingPipe implements PipeTransform {

  constructor(private translate: TranslateService) {}

  transform(value: Multiling, lang: string = this.translate.currentLang): string {
    if (!!value) {
      if (value[lang]) {
        return value[lang];
      } else {
        if (lang !== this.translate.defaultLang && value[this.translate.defaultLang]) {
          return value[this.translate.defaultLang];
        } else {
          for (const a in value) { if(value[a]) return value[a]; }
          return ''
        }
      }
    } else {
      return '';
    }
  }

}
