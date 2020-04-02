import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ClientProject } from '../../models/client-project';

@Injectable({providedIn: 'root'})
export class ClientProjectFrontService {

  private _clientProjectObj: BehaviorSubject<ClientProject> = new BehaviorSubject<ClientProject>(<ClientProject>{});

  /***
   * set the client project value using this function.
   * @param value
   */
  public setClientProject(value: ClientProject) {
    this._clientProjectObj.next(value);
  }

  /***
   * use this to listen the value in the components that
   * we set.
   */
  public clientProject(): BehaviorSubject<ClientProject> {
    return this._clientProjectObj;
  }

}
