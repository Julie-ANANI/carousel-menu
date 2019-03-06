import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ScrollService {

  private _defaultScrollValue = new BehaviorSubject(0);

  scrollValue = this._defaultScrollValue.asObservable();

  constructor() { }

  setScrollValue(value: any) {
    return this._defaultScrollValue.next(value);
  }

  get defaultScrollValue(): BehaviorSubject<number> {
    return this._defaultScrollValue;
  }

}
