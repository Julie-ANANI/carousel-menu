/***
 * this service is to listen the mouse click event on the page. With this
 * will get the container / section Id to show or hide the dropdown menu,
 * popover, etc.
 */

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MouseService {

  target: Subject<string> = new Subject<string>();

  parent: Subject<string> = new Subject<string>();

  parentOffset: Subject<string> = new Subject<string>();

  container: Subject<Array<string>> = new Subject<Array<string>>();

  constructor() { }

  public setClickEvent(event: Event) {
    this._setTargetId(event);
    this._setTargetParentId(event);
    this._setTargetParentOffsetId(event);
    this._setAll(event);
  }

  private _setTargetId(event: Event) {
    if (event && event.target && event.target['id']) {
      this.target.next(event.target['id']);
    } else {
      this.target.next('');
    }
  }

  public targetId(): Subject<string> {
    return this.target;
  }

  private _setTargetParentId(event: Event) {
    if (event && event.target && event.target['parentNode'] && event.target['parentNode']['id']) {
      this.parent.next(event.target['parentNode']['id']);
    } else {
      this.parent.next('');
    }
  }

  public targetParentId(): Subject<string> {
    return this.parent;
  }

  private _setTargetParentOffsetId(event: Event) {
    if (event && event.target && event.target['parentNode'] && event.target['parentNode']['offsetParent'] && event.target['parentNode']['offsetParent']['id']) {
      this.parentOffset.next(event.target['parentNode']['offsetParent']['id']);
    } else {
      this.parentOffset.next('');
    }
  }

  public targetParentOffsetId(): Subject<string> {
    return this.parentOffset;
  }

  private _setAll(event: Event) {
    let ids: Array<string> = [];

    if (event && event.target && event.target['id']) {
      ids.push(event.target['id']);
    }

    if (event && event.target && event.target['parentNode'] && event.target['parentNode']['id']) {
      ids.push(event.target['parentNode']['id']);
    }

    if (event && event.target && event.target['parentNode'] && event.target['parentNode']['offsetParent'] && event.target['parentNode']['offsetParent']['id']) {
      ids.push(event.target['parentNode']['offsetParent']['id']);
    }

    this.container.next(ids);

  }

  public containerIds(): Subject<Array<string>> {
    return this.container;
  }

}
