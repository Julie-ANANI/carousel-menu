import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'stopat'})
export class StopAtPipe implements PipeTransform {
  transform(value: Array<any>, end: number) {
    return value.slice(0, end);
  }
}
