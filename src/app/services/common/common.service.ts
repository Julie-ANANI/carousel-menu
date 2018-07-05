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
   * Merge JS Objects (Object & Array) in functional style
   * Does not modify objects (immutable) and merges arrays via concatenation.
   */
  deepMerge(mergeArrayStrategy: 'rewrite' | 'concat' | 'deepMerge' = 'rewrite', ...objects: Array<any>): any {
    const isObject = (o: any) => o && typeof o === 'object';

    return objects.reduce((acc, obj) => {
      Object.keys(obj).forEach(key => {
        const accVal = acc[key];
        const objVal = obj[key];

        if (Array.isArray(accVal) && Array.isArray(objVal)) {
          switch (mergeArrayStrategy) {
            case 'rewrite':
              acc[key] = objVal;
              break;
            case 'concat':
              acc[key] = accVal.concat(...objVal);
              break;
            case 'deepMerge':
              acc[key] = [];
              const maxSize = Math.max(accVal.length, objVal.length);
              this.range(0, maxSize).forEach((i) => {
                const a = i < accVal.length ? accVal[i] : undefined;
                const b = i < objVal.length ? objVal[i] : undefined;
                acc[key].push(this.deepMerge(a, b));
              });
              break;
          }
        }
        else if (isObject(accVal) && isObject(objVal)) {
          acc[key] = this.deepMerge(accVal, objVal);
        }
        else {
          acc[key] = objVal;
        }
      });

      return acc;
    }, {});
  }

}

