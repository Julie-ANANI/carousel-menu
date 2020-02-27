import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {

  private _spinnerValue: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {}

  public state(value: boolean) {
    this._spinnerValue.next(value);
  }

  public spinner(): BehaviorSubject<boolean> {
    return this._spinnerValue;
  }

}
