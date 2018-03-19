import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() {}

  /*
   * range function (inspired from Python)
   * return an array with every numbers from 0 to x-1
   */
  range(x: number): Array<number> {
    function* numberGenerator(maxVal: number): IterableIterator<number> {
      let currVal = 0;
      while (currVal < maxVal) {
        yield currVal++;
      }
    }
    return [...Array.from(numberGenerator(x))];
  }
}

