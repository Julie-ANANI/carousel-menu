import { Pipe, PipeTransform } from '@angular/core';
import {CommonService} from '../../services/common/common.service';
import {DatePipe} from '@angular/common';
import {MissionQuestionService} from '../../services/mission/mission-question.service';

type requested = 'dateFormat' | 'entry';

@Pipe({
  name: 'common'
})
export class CommonPipe implements PipeTransform {

  constructor(private _datePipe: DatePipe) {
  }

  transform(value: any, requested: requested, lang = 'en'): any {
    if (!value && !requested) return '';

    switch (requested) {
      case 'entry':
        return MissionQuestionService.entryInfo(value, lang);
      case 'dateFormat':
        return this._datePipe.transform(value, CommonService.dateFormat(lang, true));
    }
  }

}
