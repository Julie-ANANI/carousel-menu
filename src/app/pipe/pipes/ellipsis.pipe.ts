import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'ellipsis'})

export class EllipsisPipe implements PipeTransform {

  transform(value: string, limit: number): string {
    if (value && value.length > limit) {
      return value.slice(0, limit) + '…';
    } else {
      return value;
    }
  }

}
