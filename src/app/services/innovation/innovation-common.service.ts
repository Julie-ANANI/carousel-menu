/***
 * This service is used to perform all the innovation related
 * cross component communication in the app.
 */

import { Injectable } from '@angular/core';
import { Innovation } from '../../models/innovation';
import { Subject } from 'rxjs';
import { InnovationService } from './innovation.service';

@Injectable()
export class InnovationCommonService {

  innovationSubject = new Subject<Innovation>();

  saveNotifySubject = new Subject<boolean>();

  constructor(private innovationService: InnovationService) { }

  setInnovation(innovation: Innovation) {
    this.innovationSubject.next(innovation);
  }

  getInnovation(): Subject<Innovation> {
    return this.innovationSubject;
  }

   saveInnovation(project: Innovation) {
    const marketReport = project.marketReport;
    this.innovationService.save(project._id, project).subscribe((response: Innovation) => {
      if (marketReport) {
        response.marketReport = marketReport;
      }
      this.innovationSubject.next(response);
    });
  }


  /***
   * this function is called when there are some changes and we want to notify
   * in the component that changes are to be saved or not.
   * @param value
   */
  setNotifyChanges(value: boolean) {
    this.saveNotifySubject.next(value);
  }

  getNotifyChanges(): Subject<boolean> {
    return this.saveNotifySubject;
  }


}
