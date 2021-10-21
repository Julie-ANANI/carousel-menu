import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavigationFrontService {

  private _navigation: BehaviorSubject<any> = new BehaviorSubject<any>({});

  /***
   * set the TargetPros value using this function.
   * @param value
   */
  public setNavigation(value: any) {
    this._navigation.next(value);
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public navigation(): BehaviorSubject<any> {
    return this._navigation;
  }
}
