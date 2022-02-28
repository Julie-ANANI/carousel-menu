/**
 * Created by Abhishek SAINI on 24-02-2022
 */

import {Pipe, PipeTransform} from '@angular/core';
import {Mission} from '../../models/mission';
import {MissionFrontService} from '../../services/mission/mission-front.service';

@Pipe({
  name: 'mission'
})
export class MissionPipe implements PipeTransform {

  constructor() {
  }

  transform(value: Mission = <Mission>{}, requested: 'hasMissionTemplate' | 'objectiveName', lang = 'en'): any {
    if (!value._id && !requested) return '';

    switch (requested) {
      case 'hasMissionTemplate':
        return MissionFrontService.hasMissionTemplate(value);
      case 'objectiveName':
        return MissionFrontService.objectiveName(value.template, lang)
    }
  }

}
