import { Injectable } from '@angular/core';
import { FilterService } from './filters.service';
import { Tag } from '../../../../../models/tag';

const GENERIC_FILTER_NAME = 'tags';

@Injectable()
export class TagsFiltersService {

  private _answersTagsLists: {[questionId: string]: Array<Tag>} = {};

  private _tagsList: Array<Tag>;

  private _selectedAnswersTags: {[questionId: string]: {[id: string]: boolean}} = {};

  private _selectedTags: {[id: string]: boolean} = {};

  constructor(private filterService: FilterService) { }

  /*
   * This function select every known tags but does not update the corresponding filters
   * It's useful when deleting all filters at once
   */
  public reselectEveryTags(): void {
    Object.keys(this._selectedTags).forEach((t) => {
      this._selectedTags[t] = true;
    });
    Object.keys(this._selectedAnswersTags).forEach((q) => {
      Object.keys(this._selectedAnswersTags[q]).forEach((t) => {
        this._selectedAnswersTags[q][t] = true;
      });
    });
  }

  public checkTag(id: string, value: boolean) {
    this._selectedTags[id] = value;
    // check if there is no filtered tag
    const removeFilter = value && this._tagsList.every((t) => this._selectedTags[t._id] === true);
    if (removeFilter) {
      this.filterService.deleteFilter(GENERIC_FILTER_NAME);
    } else {
      this.filterService.addFilter({
        status: 'TAG',
        questionId: GENERIC_FILTER_NAME,
        value: this._selectedTags
      });
    }
  }

  public checkAnswerTag(questionIdentifier: string, tagId: string, value: boolean) {
    this._selectedAnswersTags[questionIdentifier][tagId] = value;
    // check if there is no filtered tag
    const removeFilter = value && this._answersTagsLists[questionIdentifier].every((t) => {
      return this._selectedAnswersTags[questionIdentifier][t._id] === true;
    });
    if (removeFilter) {
      this.filterService.deleteFilter(questionIdentifier);
    } else {
      this.filterService.addFilter({
        status: 'TAG',
        questionId: questionIdentifier,
        value: this._selectedAnswersTags[questionIdentifier]
      });
    }
  }

  public setAnswerTags(questionId: string, value: Array<Tag>) {
    this._answersTagsLists[questionId] = value;
    this._selectedAnswersTags[questionId] = value.reduce(function (acc, tag) {
      acc[tag._id] = true;
      return acc;
    }, {});
    this.filterService.deleteFilter(questionId);
  }

  get answersTagsLists(): {readonly [questionId: string]: Array<Tag>} {
    /* to update value, please use setAnswerTags() method */
    return this._answersTagsLists;
  }

  get selectedTags(): {readonly [id: string]: boolean} {
    /* to update value, please use checkTag() method */
    return this._selectedTags;
  }

  get selectedAnswersTags(): {readonly [questionId: string]: {readonly [id: string]: boolean}} {
    return this._selectedAnswersTags;
  }

  get tagsList(): Array<Tag> {
    return this._tagsList;
  }

  set tagsList(value: Array<Tag>) {
    this._tagsList = value;
    this._selectedTags = value.reduce(function (acc, tag) {
      acc[tag._id] = true;
      return acc;
    }, {});
    this.filterService.deleteFilter(GENERIC_FILTER_NAME);
  }

}
