import { Injectable } from '@angular/core';
import { Innovation } from '../../../../../../models/innovation';
import { Tag } from '../../../../../../models/tag';
import { InnovCard } from '../../../../../../models/innov-card';
import { MultilingPipe } from '../../../../../../pipe/pipes/multiling.pipe';
import { Subject } from 'rxjs';

@Injectable()
export class FilterService {

  filterRemove: Subject<string> = new Subject<string>();

  static highlight: Array<string> = ['construction', 'software', 'industry', 'energy', 'healthcare', 'chemistry', 'transportation', 'services', 'environment', 'aerospace', 'network', 'it', 'sector-tag-1', 'sector-tag-3'];

  setFilterToRemove(value: string) {
    this.filterRemove.next(value);
  }


  getFilterToRemove(): Subject<string> {
    return this.filterRemove;
  }


  static getAllSectorTags(totalInnovations: Array<Innovation>) {
    let sectorTags = [];

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


  static getHighlightedTags(tags: Array<Tag>) {
    let highlightTags = [];

    if (tags.length > 0) {
      tags.forEach((tag: Tag) => {
        const include = FilterService.highlight.includes(tag.label.en.toLowerCase());
        if (include) {
          highlightTags.push(tag);
        }
      });
    }

    return highlightTags;

  }


  static sortTags(tags: Array<Tag>, userLang: string) {
    let sortTags = [];

    if (tags.length > 0) {
      sortTags = tags.sort((a: Tag, b: Tag) => {

        const labelA = MultilingPipe.prototype.transform(a.label, userLang).toLowerCase();
        const labelB =  MultilingPipe.prototype.transform(b.label, userLang).toLowerCase();

        if ( labelA > labelB) {
          return 1;
        }

        if (labelA < labelB) {
          return -1;
        }

        return 0;

      });
    }

    return sortTags;

  }


  static getFilteredInnovations(totalInnovations: Array<Innovation>, selectedTags: Array<Tag>, searchFieldInput: string = '') {
    let innovations: Array<Innovation> = [];

    if (totalInnovations.length > 0) {
      totalInnovations.forEach((innovation: Innovation) => {

        if (searchFieldInput) {
          innovation.innovationCards.forEach((card: InnovCard) => {

            const find = card.title.toLowerCase().includes(searchFieldInput.toLowerCase());

            if (find) {
              const innovationIndex = innovations.findIndex((inno: Innovation) => inno._id === innovation._id);
              if (innovationIndex === -1) {
                innovations.push(innovation);
              }
            }

          });
        }

        if (innovation.tags.length > 0 && selectedTags.length > 0) {
          innovation.tags.forEach((tag: Tag) => {
            const index = selectedTags.findIndex((filter: Tag) => filter._id === tag._id);
            if (index != -1) {
              const innovationIndex = innovations.findIndex((inno: Innovation) => inno._id === innovation._id);
              if (innovationIndex === -1) {
                innovations.push(innovation);
              }
            }
          });
        }

      });
    }

    return innovations;

  }

}
