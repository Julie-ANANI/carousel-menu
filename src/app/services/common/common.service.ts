import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import * as moment from 'moment';
import {TranslateNotificationsService} from '../translate-notifications/translate-notifications.service';
import {Etherpad} from '../../models/etherpad';
import {environment} from '../../../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {Tag} from '../../models/tag';
import {LangEntryService} from '../lang-entry/lang-entry.service';
import {UmiusCommonService} from '@umius/umi-common-component';
import {DomSanitizer} from '@angular/platform-browser';

/**
 * UmiusCommonService functions:
 *
 * 1. sortBy(value: Array<{[k: string]: any}>, property: string): Array<{[k: string]: any}>;
 * 2. ellipsisText(value: string, limit: number, dots = true): string;
 * 3. copyToClipboard(url: string);
 * 4. byPassSecurity(value: any, type: 'HTML' | 'STYLE' | 'SCRIPT' | 'URL' | 'RESOURCE_URL'):
 *     SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl;
 */

@Injectable({ providedIn: 'root' })
export class CommonService extends UmiusCommonService {

  constructor(@Inject(PLATFORM_ID) protected _platformId: Object,
              protected _translateService: TranslateService,
              private _langEntryService: LangEntryService,
              protected _domSanitize: DomSanitizer,
              private _translateNotificationsService: TranslateNotificationsService) {
    super(_platformId, _domSanitize)
  }

  public static sortByCompare(value: Array<any> = [], property: string): Array<any> {
    if (!value.length || !property) return value;
    return value.sort((a, b) => a[property].localeCompare(b[property]));
  }

  /**
   * will check the LinkedIn url has https://www. or not, if no then
   * add and return the full url.
   * @param url
   */
  public static formalizeLinkedInUrl(url: string): string {
    if (!url) return '';
    if (url.includes('https://www.linkedin.com')) return url;
    const indexOf = url.indexOf('linkedin.com/');
    return `https://www.${url.slice(indexOf)}`;
  }

  public static getRate(value1: number, value2: number, decimals?: number): string {
    const power = decimals ? Math.pow(10, decimals) : 100;
    if (value2 && (value1 || value1 === 0)) {
      return (Math.round(100 * power * value1 / value2) / power).toString() + '%';
    }
    return 'NA';
  }

  /**
   * this function is to make the textarea responsive based on the text and scroll height.
   * @param textarea
   * @param _event
   */
  public static calcTextareaHeight(textarea: HTMLTextAreaElement, _event?: KeyboardEvent) {
    const currentHeight = textarea.offsetHeight;
    const scrollHeight = textarea.scrollHeight + 2;
    const padding = 20;
    const minHeight = Number(textarea.getAttribute('min-height'));

    if (currentHeight >= minHeight || currentHeight < scrollHeight) {
      if (scrollHeight < currentHeight) {
        textarea.style.height = (scrollHeight + padding) + 'px';
      } else if (scrollHeight >= minHeight) {
        if (_event && _event.code === 'Backspace' || _event.key === 'Backspace') {
          if (currentHeight + padding > scrollHeight) {
            textarea.style.height = currentHeight - 15 + 'px';
          }
        } else if (scrollHeight !== currentHeight) {
          textarea.style.height = currentHeight + (scrollHeight - currentHeight) + padding + 'px';
        }
      }
    }

  }

  /***
   * this function is to return the color based on the length and limit.
   * @param text
   * @param limit
   */
  public static getLimitColor(text: string, limit: number): string {
    const textLength = text && text.length || 0;
    const _length =  limit - textLength;
    if (_length <= 0) {
      return '#EA5858';
    } else if (_length > 0 && _length < (limit / 2)) {
      return '#F0AD4E';
    } else {
      return '#2ECC71';
    }
  }

  /**
   *
   * @param lang - en | fr
   * @param onlyDate
   */
  public static dateFormat(lang: string, onlyDate = false): string {
    if (onlyDate) {
      return lang === 'fr' ? 'dd/MM/y' : 'y/MM/dd';
    }
    return lang === 'fr' ? 'dd/MM/y HH:mm' : 'y/MM/dd HH:mm';
  }

  /***
   * returns the src for the iframe of the etherpad.
   * @param baseUrl
   * @param value
   */
  public static etherpadSrc(value: Etherpad = <Etherpad>{}, baseUrl = `${environment.etherpadUrl}/p/`): string {
    return `${baseUrl}${value.groupID}$${value.padID}?showChat=${value.showChat}&noColors=${value.noColors}&lang=${value.lang}&userName=${value.userName}`;
  }

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
        } else if (isObject(accVal) && isObject(objVal)) {
          acc[key] = this.deepMerge(accVal, objVal);
        } else {
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

  /**
   * return the sorted tag.
   * @param tags
   * @param userLang
   */
  public sortTags(tags: Array<Tag> = [], userLang: string) {
    if (!tags.length || !userLang) return [];
    return tags.sort((a: Tag, b: Tag) => {
      const labelA = this._langEntryService.tagEntry(a, 'label', userLang).toLocaleLowerCase();
      const labelB = this._langEntryService.tagEntry(b, 'label', userLang).toLocaleLowerCase();
      return labelA.localeCompare(labelB);
    });
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

  /***
   * play the audio sound.
   * @param file
   */
  public playAudio(file: any) {
    const sound = new Audio('data:audio/mpeg;base64,' + Buffer.from(file).toString('base64'));
    sound.play().then( () => {
      console.log('Played successfully!');
    }).catch((err) => {
      console.error(err);
      this._translateNotificationsService.error('Error', 'The audio could not be played at the moment.');
    });
  }

  /**
   * one place for the date format based on the platform lang.
   */
  public dateFormat(): string {
    return this._translateService.currentLang === 'fr' ? 'dd/MM/y' : 'MM/dd/y';
  }

}

