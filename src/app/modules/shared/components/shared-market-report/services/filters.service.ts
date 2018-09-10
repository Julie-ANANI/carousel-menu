import { Injectable } from '@angular/core';
import { Answer } from '../../../../../models/answer';
import { Filter } from '../models/filter';
import { Tag } from '../../../../../models/tag';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilterService {

  private _filters: {[questionId: string]: Filter} = {};
  private _filtersUpdate = new Subject<null>();

  constructor() {
    this.reset();
  }

  reset(): void {
    this._filters = {};
    this._filtersUpdate.next();
  }

  public addFilter(filter: Filter) {
    this._filters[filter.questionId] = filter;
    this._filtersUpdate.next();
  }

  public deleteFilter(key: string) {
    delete this._filters[key];
    this._filtersUpdate.next();
  }

  public filter(answers: Array<Answer>): Array<Answer> {
    let filteredAnswers = answers;
    Object.keys(this._filters).forEach((filterKey) => {
      const filter = this._filters[filterKey];
      switch (filter.status) {
        case 'TAG':
          filteredAnswers = filteredAnswers.filter((answer) => {
            if (filter.questionId && Array.isArray(answer.answerTags[filter.questionId])) {
              return answer.answerTags[filter.questionId].some((t: Tag) => t._id === filter.value);
            } else if (!filter.questionId) {
              return answer.tags.some((t: Tag) => t._id === filter.value);
            } else {
              return false;
            }
          });
          break;
        case 'CHECKBOX':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return answer.answers[filter.questionId] && answer.answers[filter.questionId][filter.value];
          });
          break;
        case 'CLEARBIT':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return Array.isArray(answer.answers[filter.questionId]) &&
              answer.answers[filter.questionId].some((item: any) => item.name === filter.value);
          });
          break;
        case 'COUNTRIES':
          filteredAnswers = filteredAnswers.filter((answer) => {
            const country = answer.country.flag || answer.professional.country;
            return filter.value.some((c: string) => c === country);
          });
          break;
        case 'LIST':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return Array.isArray(answer.answers[filter.questionId]) &&
              answer.answers[filter.questionId].some((item: any) => item.text === filter.value);
          });
          break;
        case 'PROFESSIONALS':
          filteredAnswers = filteredAnswers.filter((answer) => filter.value.indexOf(answer._id) === -1 );
          break;
        case 'RADIO':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return answer.answers[filter.questionId] === filter.value;
          });
          break;
        default:
          console.log(`Unknown filter type: ${filter.status}.`);
      }
    });
    return filteredAnswers;
  }

  get filters() { return this._filters; }
  get filtersUpdate() { return this._filtersUpdate; }
}
