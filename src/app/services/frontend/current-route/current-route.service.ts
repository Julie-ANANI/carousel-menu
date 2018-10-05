import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CurrentRouteService {
  currentRoute = new Subject<string>();

  constructor() { }

  setCurrentRoute(value: string) {
    this.currentRoute.next(value);
  }

  getCurrentRoute(): Subject<string> {
    return this.currentRoute;
  }

}
