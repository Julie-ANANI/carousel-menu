import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'InnovCardTitle'
})

export class InnovCardTitlePipe implements PipeTransform {

  private _toMatch = ['la', 'le', 'La', 'Le'];

  transform (actualTitle: string, content: string, lang = 'en'): string {
    if (actualTitle) {
      if (content) {
        this._replaceTitle(actualTitle);
        return lang === 'fr' ? this._replaceTitle(actualTitle) : `${actualTitle.charAt(0).toUpperCase()}${actualTitle.slice(1)}`;
      } else {
        return lang === 'fr' ? `Remplir ${actualTitle.toLowerCase()}` : `Fill in the ${actualTitle.toLowerCase()}`;
      }
    }
    return actualTitle;
  }

  private _replaceTitle(title: string) {
    let _title = title;
    this._toMatch.forEach((str) => {
      const _index = title.indexOf(str);
      if (_index !== -1) {
        const _rep = title.replace(str, ' ').trim();
        _title = `${_rep.charAt(0).toUpperCase()}${_rep.slice(1)}`;
      }
    });
    return _title;
  }

}

