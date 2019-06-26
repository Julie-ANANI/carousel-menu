import { Injectable } from '@angular/core';
import { LocalStorageService } from '../localStorage/localStorage.service';

@Injectable()
export class ConfigService {

  constructor(private _localStorageService: LocalStorageService) { }

  public configLimit(selector: string): string {

    if (this._localStorageService.getItem(`${selector}-limit`)) {
      return this._localStorageService.getItem(`${selector}-limit`);
    }

    this._localStorageService.setItem(`${selector}-limit`, '10');

    return '10';

  }


}
