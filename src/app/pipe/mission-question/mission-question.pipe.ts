/**
 * Created by Abhishek SAINI on 13-04-2022
 */

import { Pipe, PipeTransform } from '@angular/core';
import {MissionQuestion} from '../../models/mission';
import {MissionFrontService} from '../../services/mission/mission-front.service';

type requested = 'objectiveName';

@Pipe({
  name: 'missionQuestion'
})
export class MissionQuestionPipe implements PipeTransform {

  transform(value: MissionQuestion = <MissionQuestion>{}, requested: requested, lang = 'en'): any {
    if (!value._id && !requested) return '';

    switch (requested) {
      case 'objectiveName':
        return MissionFrontService.objectiveName(value, lang);
    }
  }

}
