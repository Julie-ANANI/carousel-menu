/***
 * this service is to listen the mouse click event on the page.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MouseService {
  clickEvent = new Subject<Event>();

  constructor() { }

  setClickEvent(value: Event) {
    this.clickEvent.next(value);
  }

  getClickEvent(): Subject<Event> {
    return this.clickEvent;
  }

}
