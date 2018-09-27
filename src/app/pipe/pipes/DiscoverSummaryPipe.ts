import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'DiscoverSummaryPipe'
})

export class DiscoverSummaryPipe implements PipeTransform {

  transform (value: string, limit: number): string {

    if (value && value.length > limit) {
      return value.slice(0, limit) + '...';
    } else {
      return value;
    }

  }

}

