import {Injectable} from '@angular/core';
import {Answer} from '../../../../../models/answer';
import {Filter} from '../models/filter';
import {Tag} from '../../../../../models/tag';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FilterService {

  private _filters: {[questionId: string]: Filter} = {};
  private _filtersUpdate = new Subject<null>();

  constructor() {
    this.reset();
  }

  public reset(): void {
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
    console.log('filter service');
    console.log(answers);
    let filteredAnswers = answers;
    console.log(this._filters);
    Object.keys(this._filters).forEach((filterKey) => {
      console.log('filter key filter service: ' + filterKey);
      const filter = this._filters[filterKey];
      console.log(filter);
      switch (filter.status) {
        case 'TAG':
          if (filter.questionId === 'tags') {
            filteredAnswers = filteredAnswers.filter((answer) => {
              return answer.tags.some((t: Tag) => filter.value[t._id]);
            });
            console.log('after filter tags filter service');
            console.log(filteredAnswers);
          } else {
            filteredAnswers = filteredAnswers.filter((answer) => {
              return Array.isArray(answer.answerTags[filter.questionId])
                && answer.answerTags[filter.questionId].some((t: Tag) => filter.value[t._id]);
            });
          }
          break;
        case 'CHECKBOX':
          filteredAnswers = filteredAnswers.filter((answer) => {
            if (answer.answers[filter.questionId]) {
              return Object.keys(filter.value).some((k) => filter.value[k] && answer.answers[filter.questionId][k]);
            } else {
              return false;
            }
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
            const country = (answer.country && answer.country.flag) || answer.professional.country;
            const selectedCountries = Object.keys(filter.value.countries).filter((key) => filter.value.countries[key]);
            return selectedCountries.includes(country);
          });
          break;
        case 'CUSTOM':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return filter.value.indexOf(answer._id) !== -1;
          });
          console.log('after filter tags custom filter service');
          console.log(filteredAnswers);
          break;
        case 'LIST':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return Array.isArray(answer.answers[filter.questionId]) &&
              answer.answers[filter.questionId].some((item: any) => item.text === filter.value);
          });
          break;
        case 'PROFESSIONALS':
          filteredAnswers = filteredAnswers.filter((answer) => !filter.value[answer._id]);
          break;
        case 'RADIO':
          filteredAnswers = filteredAnswers.filter((answer) => {
            console.log('answer.answers filter service');
            console.log(answer.answers);
            console.log(filter.value);
            return filter.value[answer.answers[filter.questionId]];
          });
          console.log(filteredAnswers);
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
