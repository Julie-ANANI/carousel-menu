import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ScrollService {

  scrollEventValue = new Subject<any>();

  constructor() { }

  setScrollValue(value: any) {
    this.scrollEventValue.next(value);
  }

  getScrollValue(): Subject<any> {
    return this.scrollEventValue;
  }

}
