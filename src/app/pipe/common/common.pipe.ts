import { Pipe, PipeTransform } from '@angular/core';
import {CommonService} from '../../services/common/common.service';
import {DatePipe} from '@angular/common';

type requested = 'dateFormat';

@Pipe({
  name: 'common'
})
export class CommonPipe implements PipeTransform {

  constructor(private _datePipe: DatePipe) {
  }

  transform(value: any, requested: requested, lang = 'en'): any {
    if (!value && !requested) return '';

    switch (requested) {

      case 'dateFormat':
        return this._datePipe.transform(value, CommonService.dateFormat(lang, true));
    }
  }

}
