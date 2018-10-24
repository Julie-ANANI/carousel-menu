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

  constructor(private innovationService: InnovationService) { }

  setInnovation(innovation: Innovation) {
    this.innovationSubject.next(innovation);
  }

  getInnovation(): Subject<Innovation> {
    return this.innovationSubject;
  }

   saveInnovation(project: Innovation) {
    this.innovationService.save(project._id, project).first().subscribe((response: Innovation) => {
      this.innovationSubject.next(response);
    });
  }

}
