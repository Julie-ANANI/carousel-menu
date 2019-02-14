import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'DiscoverSummaryPipe'
})

export class DiscoverSummaryPipe implements PipeTransform {

  transform (value: string, limit: number): string {

    let text = '';

    if (value && value.length > limit) {
      text = value.slice(0, limit) + '...';
    } else {
      text = value;
    }

    return text;

  }

}

