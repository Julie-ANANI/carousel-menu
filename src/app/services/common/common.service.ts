import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor() {}

  /*
   * range function (inspired from Python)
   * return an array with every numbers from 0 to x-1
   */
  range(min: number = 0, max: number = 10, step: number = 1): Array<number> {
    function* numberGenerator(minVal: number, maxVal: number, stepVal: number): IterableIterator<number> {
      let currVal = minVal;
      while (currVal < maxVal) {
        yield currVal;
        currVal += stepVal;
      }
    }
    return Array.from(numberGenerator(min, max, step));
  }

  /*
   * Object.assign() function but recursively
   */
  deepMerge(obj1: any, obj2: any): any {
    return Object.assign(obj1, obj2);
  }
}

