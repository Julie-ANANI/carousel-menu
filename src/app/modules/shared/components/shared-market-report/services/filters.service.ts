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
    let filteredAnswers = answers;
    Object.keys(this._filters).forEach((filterKey) => {
      const filter = this._filters[filterKey];
      switch (filter.status) {
        case 'TAG':
          if (filter.questionId === 'tags') {
            filteredAnswers = filteredAnswers.filter((answer) => {
              return answer.tags.some((t: Tag) => filter.value[t._id]);
            });
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
        /**
         * country exists in answer and pro.
         * in Answer.country,
         * usually it's an object contains {name: '', flag: '', domain:''},
         * but sometimes it would be a string, so we add a condition to avoid this case
         * in pro, it's a string. could be upperCase or lowerCase
         */
        case 'COUNTRIES':
          filteredAnswers = filteredAnswers.filter((answer) => {
            const types = {
              string: answer.country,
              object: answer.country && answer.country.flag
            }
            let country = types[typeof answer.country];
            if(!country) {
              country = (answer.professional && answer.professional.country) || '';
            }

            const selectedCountries = Object.keys(filter.value.countries).filter((key) => filter.value.countries[key]);
            return selectedCountries.includes(country.toUpperCase());
          });
          break;
        case 'CUSTOM':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return filter.value.indexOf(answer._id) !== -1;
          });
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
            return filter.value[answer.answers[filter.questionId]];
          });
          break;

        case 'LIKERT-SCALE':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return filter.value[answer.answers[filter.questionId]];
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
