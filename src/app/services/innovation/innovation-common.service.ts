/***
 * This service is used to perform all the innovation related
 * cross component communication in the app.
 */

import { Injectable } from '@angular/core';
import { Innovation } from '../../models/innovation';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class InnovationCommonService {

  innovationSubject = new Subject<Innovation>();

  constructor() { }

  setInnovation(innovation: Innovation) {
    this.innovationSubject.next(innovation);
  }

  getInnovation(): Subject<Innovation> {
    return this.innovationSubject;
  }

}
