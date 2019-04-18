import { Injectable } from '@angular/core';
import { SharedWorldmapService } from '../../shared-worldmap/shared-worldmap.service';
import { Answer } from '../../../../../models/answer';
import { Filter } from '../models/filter';
import { Tag } from '../../../../../models/tag';
import { Subject } from 'rxjs';

@Injectable()
export class FilterService {

  private _filters: {[questionId: string]: Filter} = {};
  private _filtersUpdate = new Subject<null>();

  constructor(private _sharedWorld: SharedWorldmapService) {
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
        case 'COUNTRIES':
          filteredAnswers = filteredAnswers.filter((answer) => {
            const country = answer.country.flag || answer.professional.country;
            return this._sharedWorld.isCountryInSelectedContinents(country,  filter.value);
          });
          break;
        case 'CUSTOM':
          filteredAnswers = filteredAnswers.filter((answer) => {
            return filter.value.includes(answer._id);
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
        default:
          console.log(`Unknown filter type: ${filter.status}.`);
      }
    });
    return filteredAnswers;
  }

  get filters() { return this._filters; }
  get filtersUpdate() { return this._filtersUpdate; }
}
