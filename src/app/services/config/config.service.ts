import { Injectable } from '@angular/core';
import { LocalStorageService } from '@umius/umi-common-component/services/localStorage';

@Injectable({providedIn: 'root'})
export class ConfigService {

  constructor(private _localStorageService: LocalStorageService) { }

  public configLimit(selector: string): string {

    if (this._localStorageService.getItem(selector) && !isNaN(parseInt(this._localStorageService.getItem(selector)))) {
      return this._localStorageService.getItem(selector);
    }

    this._localStorageService.setItem(selector, '10');

    return '10';

  }


}
