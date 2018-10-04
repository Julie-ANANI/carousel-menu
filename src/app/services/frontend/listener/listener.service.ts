import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ListenerService {
  clickEvent = new Subject<Event>();

  constructor() { }

  setClickEvent(value: Event) {
    this.clickEvent.next(value);
  }

  getClickEvent(): Subject<Event> {
    return this.clickEvent;
  }

}
