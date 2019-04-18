import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class FilterService {

  searchOutput: Subject<string> = new Subject<string>();

  constructor() { }

  setSearchOutput(value: string) {
    this.searchOutput.next(value);
  }

  getSearchOutput(): Subject<string> {
    return this.searchOutput;
  }

}
