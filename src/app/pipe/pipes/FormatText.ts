import { Pipe, PipeTransform } from '@angular/core';

@Pipe ({
  name: 'formattext'
})

export class FormatText implements PipeTransform {

  transform (value: string): string {

    if (value) {
      return value.charAt(0).toUpperCase() + value.toLowerCase().slice(1)
    } else {
      return value;
    }

  }

}

