import { Injectable } from '@angular/core';
import { FilterService } from './filters.service';
import { Tag } from '../../../../../models/tag';

const GENERIC_FILTER_NAME = 'tags';

@Injectable()
export class TagsService {

  private _tagsList: Array<Tag>;

  private _selectedTags: {[id: string]: boolean} = {};

  constructor(private filterService: FilterService) { }

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

  get selectedTags() {
    return this._selectedTags;
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
