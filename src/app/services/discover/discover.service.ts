import { Injectable } from '@angular/core';
import { Innovation } from '../../models/innovation';
import { Tag } from '../../models/tag';
import { InnovCard } from '../../models/innov-card';
import { MultilingPipe } from '../../pipe/pipes/multiling.pipe';
import { Subject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DiscoverService {

  filterRemove: Subject<string> = new Subject<string>();

  static highlight: Array<string> = ['civil engineering', 'construction', 'industry', 'manufacturing', 'energy', 'healthcare', 'pharma', 'chemistry', 'transport', 'service', 'environment', 'telecom', 'materials', 'chemicals', 'electronic', 'food', 'medical device', 'agriculture', 'it'];

  constructor(private multiling: MultilingPipe) {}

  static getAllSectorTags(totalInnovations: Array<Innovation>): Array<Tag> {
    const sectorTags: Array<Tag> = [];
    totalInnovations.forEach((innovation) => {
      innovation.tags.forEach((tag: Tag) => {
        if (tag.type === 'SECTOR') {
          const find = sectorTags.find((item: Tag) => item._id === tag._id);
          if (!find) {
            sectorTags.push(tag);
          }
        }
      });
    });
    return sectorTags;
  }


  static getHighlightedTags(tags: Array<Tag>): Array<Tag> {
    const highlightTags: Array<Tag> = [];
    if (tags.length > 0) {
      tags.forEach((tag: Tag) => {
        const index = DiscoverService.highlight.indexOf(tag.label.en.toLowerCase());
        if (index !== -1) {
          highlightTags.push(tag);
        }
      });
    }
    return highlightTags;
  }


  static getFilteredInnovations(totalInnovations: Array<Innovation>, selectedTags: Array<Tag>, searchFieldInput: string = '') {
    if (totalInnovations.length > 0) {
      return totalInnovations.filter((innovation: Innovation) => {

        if (searchFieldInput) {
          // we check if there is any card containing searchFieldInput
          const containSearchFieldInput = innovation.innovationCards.some((card: InnovCard) => {
            return card.title.toLowerCase().indexOf(searchFieldInput.toLowerCase()) !== -1;
          });
          if (!containSearchFieldInput) {
            return false;
          }
        }

        if (selectedTags.length > 0) {
          // we check common tags between innovation.tags & selectedTags
          const intersection = innovation.tags.filter((t) => selectedTags.some((st) => t._id === st._id));
          if (intersection.length === 0) {
            return false;
          }
        }

        return true;

      });
    }
    return [];
  }

  setFilterToRemove(value: string) {
    this.filterRemove.next(value);
  }

  getFilterToRemove(): Subject<string> {
    return this.filterRemove;
  }

  public sortTags(tags: Array<Tag>, userLang: string) {
    if (tags.length > 0) {
      return tags.sort((a: Tag, b: Tag) => {
        const labelA = this.multiling.transform(a.label, userLang).toLowerCase();
        const labelB =  this.multiling.transform(b.label, userLang).toLowerCase();
        return labelA.localeCompare(labelB);
      });
    }
    return [];
  }

}
