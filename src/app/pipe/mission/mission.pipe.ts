/**
 * Created by Abhishek SAINI on 24-02-2022
 */

import {Pipe, PipeTransform} from '@angular/core';
import {Mission} from '../../models/mission';
import {MissionFrontService} from '../../services/mission/mission-front.service';

type requested = 'hasMissionTemplate' | 'objectiveName' | 'essentialsQuestions';

@Pipe({
  name: 'mission'
})
export class MissionPipe implements PipeTransform {

  constructor() {
  }

  transform(value: Mission = <Mission>{}, requested: requested, lang = 'en'): any {
    if (!value._id && !requested) return '';

    switch (requested) {
      case 'hasMissionTemplate':
        return MissionFrontService.hasMissionTemplate(value);
      case 'objectiveName':
        return MissionFrontService.objectiveName(value.template, lang);
      case 'essentialsQuestions':
        return MissionFrontService.essentialQuestions(MissionFrontService.totalTemplateQuestions(value.template));
    }
  }

}
