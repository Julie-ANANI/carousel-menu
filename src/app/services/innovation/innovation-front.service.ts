/***
 * This service is used to perform all the innovation related
 * cross component communication in the app.
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Innovation } from '../../models/innovation';
import { InnovationService } from './innovation.service';
import { TranslateNotificationsService } from '../notifications/notifications.service';

@Injectable()

export class InnovationFrontService {
  get defaultInnovation(): BehaviorSubject<{}> {
    return this._defaultInnovation;
  }

  //innovation = new Subject<Innovation>();

  private _defaultInnovation = new BehaviorSubject({});

  getInnovation = this._defaultInnovation.asObservable();

  constructor(private innovationService: InnovationService,
              private translateNotificationsService: TranslateNotificationsService) { }

  setInnovation(innovation: Innovation) {
    this._defaultInnovation.next(innovation);
  }


  saveInnovation(innovation: Innovation) {
    const marketReport = innovation.marketReport;

    this.innovationService.save(innovation._id, innovation).subscribe((response: Innovation) => {
      if (marketReport) {
        response.marketReport = marketReport;
      }
      this.setInnovation(response);
      this.translateNotificationsService.success('ERROR.PROJECT.SAVED', 'ERROR.PROJECT.SAVED_TEXT');
    }, () => {
      this.translateNotificationsService.error('ERROR.ERROR', 'ERROR.SERVER_ERROR');
    });

  }


}

