import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Mission } from '../../models/mission';

@Injectable({providedIn: 'root'})
export class MissionFrontService {

  private _missionObj: BehaviorSubject<Mission> = new BehaviorSubject<Mission>(<Mission>{});

  /***
   * set the mission value using this function.
   * @param value
   */
  public setMission(value: Mission) {
    this._missionObj.next(value);
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public mission(): BehaviorSubject<Mission> {
    return this._missionObj;
  }

}
