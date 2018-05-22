import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'objectKeys'})
export class ObjectKeysPipe implements PipeTransform {

  transform(value: Object): Array<string> {
    return Object.keys(value);
  }

}
