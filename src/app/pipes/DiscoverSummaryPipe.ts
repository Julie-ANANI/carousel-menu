import {Pipe, PipeTransform} from '@angular/core';

@Pipe ({
  name: 'DiscoverSummaryPipe'
})

export class DiscoverSummaryPipe implements PipeTransform {
  private defaultSummaryLength = 191;

  transform (value: string) {

    if (value.length < this.defaultSummaryLength) {
      return value;
    } else {
        const index = value.indexOf('.');

        if (index <= this.defaultSummaryLength) {
          return value.slice(0, index + 1);
        }
        else {
          return value.slice(0, this.defaultSummaryLength) + '..';
        }

      }

  }

}

