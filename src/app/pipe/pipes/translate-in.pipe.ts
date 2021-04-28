import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '../../i18n/i18n';

/**
 * Translate part of you HTML with a lang different from translate service lang
 * @example 'textToTranslate' | translateIn: 'fr'
 */
@Pipe({
  name: 'translateIn'
})
export class TranslateInPipe implements PipeTransform {

  constructor(private translate: TranslateService) {
  }

  transform(key: string, lang: string): string {

    const currentLangTemp = this.translate.currentLang;
    this.translate.currentLang = lang;
    const translation = this.translate.instant(key);
    this.translate.currentLang = currentLangTemp;

    return translation;
  }

}
