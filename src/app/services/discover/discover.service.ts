import { Injectable } from '@angular/core';
import { Tag } from '../../models/tag';
import { Subject } from 'rxjs';
import {LangEntryService} from '../lang-entry/lang-entry.service';

@Injectable({providedIn: 'root'})
export class DiscoverService {

  private _filterRemove: Subject<string> = new Subject<string>();

  static highlight: Array<string> = ['civil engineering', 'construction', 'industry', 'manufacturing',
    'energy', 'healthcare', 'pharma', 'chemistry', 'transport', 'service', 'environment', 'telecom',
    'materials', 'chemicals', 'electronic', 'food', 'medical device', 'agriculture', 'it'];

  constructor(private _langEntryService: LangEntryService) {}

  public getHighlightedTags(tags: Array<Tag>): Array<Tag> {
    const highlightTags: Array<Tag> = [];
    if (tags.length > 0) {
      tags.forEach((tag: Tag) => {
        const label = this._langEntryService.tagEntry(tag, 'label');
        const index = DiscoverService.highlight.indexOf(label.toLocaleLowerCase());
        if (index !== -1) {
          highlightTags.push(tag);
        }
      });
    }
    return highlightTags;
  }

  setFilterToRemove(value: string) {
    this._filterRemove.next(value);
  }

  getFilterToRemove(): Subject<string> {
    return this._filterRemove;
  }

}
