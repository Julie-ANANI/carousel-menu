import {Pipe, PipeTransform} from '@angular/core';

const status = {
  OK: 'DONE'
}

@Pipe({
  name: 'status'
})
export class StatusPipe implements PipeTransform {

  transform(value: string): string {
    return status[value] || value;
  }

}
