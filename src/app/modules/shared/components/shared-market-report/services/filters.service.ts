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

  reset(): void {
    this._filters = {};
    this._filtersUpdate.next();
  }

  public addFilter(filter: Filter) {
    switch (filter.status) {
      case 'CHECKBOX':
      case 'RADIO':
        if (this._filters[filter.questionId]
          && Array.isArray(this._filters[filter.questionId].value)) {
          // if filter already exist, we search if the value already exist
          const idx = this._filters[filter.questionId].value.indexOf(filter.value);
          if (idx === -1) {
            // If value dosen't exist we push it in the filter
            this._filters[filter.questionId].value.push(filter.value);
          } else {
            // if value already exist, we remove it from the filter
            this._filters[filter.questionId].value.splice(idx, 1);
            // and if the filter doesn't filter anything, we remove it
            if (this._filters[filter.questionId].value.length === 0) {
              delete this._filters[filter.questionId];
            }
          }
        } else {
          this._filters[filter.questionId] = {...filter, value: [filter.value]};
        }
        break;
      default:
        this._filters[filter.questionId] = filter;
    }
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
            return answer.answers[filter.questionId] && filter.value.some((val: string) => answer.answers[filter.questionId][val]);
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
            return filter.value.indexOf(answer.answers[filter.questionId]) !== -1;
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
