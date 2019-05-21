import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'orderBy'})

export class OrderByPipe implements PipeTransform {

  transform(value: Array<{[k: string]: any}>, property: string): Array<{[k: string]: any}> {
    return value.sort((a, b) => (a[property] > b[property]) ? -1 : 1);
  }

}
