import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'removespaces'})

export class RemoveSpacesPipe implements PipeTransform {

    transform(value: string) {
      return value.replace(/\s/g, '');
    }

}
