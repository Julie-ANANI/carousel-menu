import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class CommonService {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object) {}

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



  configToString(configObj: {[k: string]: any}): {[k: string]: string} {
    const config: {[k: string]: string} = {};
    Object.keys(configObj).forEach((key: string) => {
      if (configObj[key] instanceof Object) {
        config[key] = JSON.stringify(configObj[key]);
      } else {
        config[key] = configObj[key];
      }
    });
    return config;
  }

  /***
   * this function is to copy the url/link/text to the
   * clipboard.
   * @param url
   */
  public copyToClipboard(url: string) {
    if (url) {
      if (isPlatformBrowser(this._platformId)) {
        let textbox = document.createElement('textarea');
        textbox.style.position = 'fixed';
        textbox.style.left = '0';
        textbox.style.top = '0';
        textbox.style.opacity = '0';
        textbox.value = url;
        document.body.appendChild(textbox);
        textbox.focus();
        textbox.select();
        document.execCommand('copy');
        document.body.removeChild(textbox);
      }
    }
  }

  /***
   * this function is to return the color based on the length and limit.
   * @param textLength
   * @param limit
   */
  public static getLimitColor(textLength: number, limit: number): string {

    const length = limit - textLength;

    if (length <= 0) {
      return '#EA5858';
    } else if (length > 0 && length < (limit/2)) {
      return '#F0AD4E';
    } else {
      return '#2ECC71';
    }

  }

  /***
   * this return the date of the future month in the format 'YYYY-MM-DD'.
   */
  public getFutureMonth() {
    const currentDate = moment();
    let futureMonth = moment(currentDate).add(1, 'M');
    const futureMonthEnd = moment(futureMonth).endOf('month');

    if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
      futureMonth = futureMonth.add(1, 'd');
    }

    return futureMonth.format('YYYY-MM-DD');

  }

}

