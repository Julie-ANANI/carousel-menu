import { Pipe, PipeTransform } from '@angular/core';
import { Answer } from '../../../../../models/answer';

@Pipe({name: 'answerslimiter'})

export class AnswersLimiterPipe implements PipeTransform {

    transform(arrayValue: Array<Answer>) {
      const answers: Array<Answer> = [];

      if (arrayValue) {
        arrayValue.forEach((items) => {
          if (items.professional.company) {
            answers.push(items);
          }
        })
      }

      return answers

    }

}
