import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CurrentRouteService {
  currentRoute = new Subject<any>();

  constructor() { }

  setCurrentRoute(value: any) {
    this.currentRoute.next(value);
  }

  getCurrentRoute(): Subject<any> {
    return this.currentRoute;
  }

}
