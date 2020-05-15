import { Injectable } from '@angular/core';
import { Answer } from '../../models/answer';

@Injectable({ providedIn: 'root' })
export class AnswerFrontService {

  /***
   * returns the answer in the form of anonymously.
   * @param answers
   */
  public static anonymous(answers: Array<Answer>): Array<Answer> {
    let _answers: Array<Answer> = [];

    if (answers.length > 0) {
      _answers = <Array<Answer>>answers.map( (answer) => {
        const _answer = {};

        Object.keys(answer).forEach(key => {
          switch(key) {

            case('company'):
              _answer[key] = {
                name: ''
              };
              break;

            case('professional'):
              _answer[key] = {
                language: answer[key].language || 'en'
              };
              if (answer[key]['company']) {
                _answer[key]['company'] = {
                  name: ''
                };
              }
              break;

            default:
              _answer[key] = answer[key];
          }
        });

        return _answer;

      });

    }

    return _answers;
  }

  /***
   * returns the sorted answer by the profile quality
   * @param answers
   */
  public static qualitySort(answers: Array<Answer>): Array<Answer> {
    let _answers: Array<Answer> = [];

    if (answers.length > 0) {
      _answers = answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });
    }

    return _answers;
  }

}
