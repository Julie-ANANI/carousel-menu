import {Injectable} from '@angular/core';
import {Answer} from '../../models/answer';
import {Tag} from '../../models/tag';

@Injectable({ providedIn: 'root' })
export class AnswerFrontService {

  /***
   * returns the answer in the form of anonymously.
   * @param answers
   */
  public static anonymous(answers: Array<Answer>): Array<Answer> {
    let _answers: Array<Answer> = [];

    if (answers && answers.length > 0) {
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
                language: answer[key] && answer[key].language || 'en'
              };
              if (answer[key] && answer[key]['company']) {
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

    if (answers && answers.length > 0) {
      _answers = answers.sort((a, b) => {
        return b.profileQuality - a.profileQuality;
      });
    }

    return _answers;
  }

  /***
   * this returns the tags occurrence for the answers and also sort them by the
   * occurrence.
   * @param answers
   */
  public static tagsOccurrence(answers: Array<Answer>): Array<Tag> {
    let _tags: Array<Tag> = [];
    if (answers && answers.length > 0) {
      answers.forEach((answer) => {
        const _answerTags = answer.tags;
        if (Array.isArray(_answerTags) && _answerTags.length) {
          _answerTags.forEach((tag) => {
            const _previousTag = _tags.findIndex((t) => t._id === tag._id);
            if (_previousTag !== -1) {
              _tags[_previousTag].count += 1;
            } else {
              tag.count = 1;
              _tags.push(tag);
            }
          });
        }
      });
      _tags = _tags.sort((a, b) => b.count - a.count);
    }
    return _tags;
  }

}
