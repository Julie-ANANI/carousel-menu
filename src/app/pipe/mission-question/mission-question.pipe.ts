/**
 * Created by Abhishek SAINI on 13-04-2022
 */

import { Pipe, PipeTransform } from '@angular/core';
import {MissionQuestion} from '../../models/mission';
import {MissionFrontService} from '../../services/mission/mission-front.service';
import {MissionQuestionService} from '../../services/mission/mission-question.service';

type requested = 'objectiveName' | 'entry';

@Pipe({
  name: 'missionQuestion'
})
export class MissionQuestionPipe implements PipeTransform {

  transform(value: MissionQuestion = <MissionQuestion>{}, requested: requested, lang = 'en'): any {
    if (!value._id && !requested) return '';

    switch (requested) {
      case 'entry':
        return MissionQuestionService.entryInfo(value, lang);
      case 'objectiveName':
        return MissionFrontService.objectiveName(value, lang);
    }
  }

}
