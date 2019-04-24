import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Innovation } from '../../../../../../models/innovation';
import { Tag } from '../../../../../../models/tag';
import { InnovCard } from '../../../../../../models/innov-card';

@Injectable()
export class FilterService {

  searchOutput: Subject<string> = new Subject<string>();


  setSearchOutput(value: string) {
    this.searchOutput.next(value);
  }


  getSearchOutput(): Subject<string> {
    return this.searchOutput;
  }


  static getFilteredInnovations(totalInnovations: Array<Innovation>, selectedTags: Array<Tag>, searchFieldInput: string) {
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
